#!/usr/bin/env python3
"""
Build assets/story-montage.mp4 from assets/story-src/*.mov + p1-4.png.
Generates an ffmpeg filter_complex graph (written to a script file to
avoid Windows command-line length limits) and runs a 2-pass libx264 encode.

Usage:  python scripts/build-story.py
Requires ffmpeg/ffprobe on PATH (winget install Gyan.FFmpeg).
"""
import json
import math
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "story-src")
OUT = os.path.join(ROOT, "assets", "story-montage.mp4")
TMP = os.path.join(ROOT, "assets", "story-src", "_build")
os.makedirs(TMP, exist_ok=True)

FFMPEG = os.environ.get("FFMPEG_BIN", "ffmpeg")
FFPROBE = os.environ.get("FFPROBE_BIN", "ffprobe")

W, H = 1920, 1080
FPS = 30
BG = "0xF5F1E8"
GUTTER = 16
ENTRANCE_D = 0.4          # fade + 20px slide-up entrance
SLIDE_PX = 20
STAGGER = 0.15
SCENE_XFADE = 0.4
PHOTO_XFADE = 0.5
TARGET_MB = 15
SAFETY = 0.90              # encode to 90% of budget for muxing/overhead headroom

# ── color grade applied identically to every clip/photo ──
def grade(label_in, label_out):
    return f"[{label_in}]eq=saturation=0.9,colortemperature=temperature=5500:mix=0.35:pl=0.3[{label_out}]"


def r(x, nd=4):
    return round(x, nd)


# ── scene definitions ────────────────────────────────────────────────
# each cell: (source filename, x, y, w, h, stagger_index)
SCENE_DEFS = [
    {
        "name": "scene1",
        "dur": 3.5,
        "cells": [("1.mov", 0, 0, 1920, 1080, 0)],
    },
    {
        "name": "scene2",
        "dur": 3.0,
        "cells": [
            ("2.mov", 0, 0, 1142, 1080, 0),
            ("3.mov", 1158, 0, 762, 1080, 1),
        ],
    },
    {
        "name": "scene3",
        "dur": 3.0,
        "cells": [
            ("4.mov", 0, 0, 629, 1080, 0),
            ("5.mov", 645, 0, 629, 1080, 1),
            ("6.mov", 1290, 0, 630, 1080, 2),
        ],
    },
    {
        "name": "scene4",
        "dur": 4.5,
        "cells": [
            ("7.mov", 0, 0, 952, 714, 0),      # big 2x2
            ("8.mov", 968, 0, 952, 349, 1),    # medium
            ("9.mov", 968, 365, 952, 349, 2),  # medium
            ("10.mov", 0, 730, 512, 350, 3),   # medium
            ("11.mov", 528, 730, 336, 350, 4), # small
            ("12.mov", 880, 730, 336, 350, 5), # small
            ("13.mov", 1232, 730, 336, 350, 6),# small
            ("14.mov", 1584, 730, 336, 350, 7),# small
        ],
    },
]

PHOTO_FILES = ["p1.png", "p2.png", "p3.png", "p4.png"]
PHOTO_FRAMES = 86  # ~2.867s per photo raw clip; 4 clips w/ 3x0.5s xfade -> ~9.97s

def resolve_src(name):
    p = os.path.join(SRC, name)
    if os.path.exists(p):
        return p
    alt = os.path.join(SRC, name.replace(".mov", ".MOV"))
    if os.path.exists(alt):
        return alt
    raise FileNotFoundError(name)


def main():
    inputs = []          # list of (path, extra_input_args)
    input_index = {}      # name -> index

    def add_video_input(name):
        if name in input_index:
            return input_index[name]
        idx = len(inputs)
        inputs.append((resolve_src(name), ["-stream_loop", "-1"]))
        input_index[name] = idx
        return idx

    def add_image_input(name):
        idx = len(inputs)
        photo_t = PHOTO_FRAMES / FPS + 1.0  # bound the otherwise-infinite -loop 1 stream
        inputs.append((resolve_src(name), ["-loop", "1", "-t", f"{photo_t:.4f}"]))
        input_index[name] = idx
        return idx

    filters = []
    scene_labels = []
    scene_durs = []

    # ---- scenes 1-4: grid/split scenes ----
    for sdef in SCENE_DEFS:
        sname = sdef["name"]
        dur = sdef["dur"]
        base = f"{sname}_base"
        filters.append(f"color=c={BG}:s={W}x{H}:d={r(dur)}:r={FPS}[{base}]")
        cur = base
        for ci, (fname, x, y, w, h, stagger_idx) in enumerate(sdef["cells"]):
            idx = add_video_input(fname)
            raw = f"{sname}_c{ci}_raw"
            geo = f"{sname}_c{ci}_geo"
            grd = f"{sname}_c{ci}_grd"
            fdd = f"{sname}_c{ci}_fd"
            st = r(stagger_idx * STAGGER)
            filters.append(
                f"[{idx}:v]setpts=PTS-STARTPTS,trim=0:{r(dur)},fps={FPS},"
                f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},setsar=1[{raw}]"
            )
            filters.append(grade(raw, grd))
            filters.append(
                f"[{grd}]fade=t=in:st={st}:d={ENTRANCE_D}:color={BG}[{fdd}]"
            )
            yexpr = (
                f"if(lt(t,{st}),{y+SLIDE_PX},"
                f"if(lt(t,{r(st+ENTRANCE_D)}),{y}+{SLIDE_PX}*(1-(t-{st})/{ENTRANCE_D}),{y}))"
            )
            nxt = f"{sname}_ov{ci}"
            filters.append(
                f"[{cur}][{fdd}]overlay=x={x}:y='{yexpr}':eval=frame[{nxt}]"
            )
            cur = nxt
        scene_labels.append(cur)
        scene_durs.append(dur)

    # ---- scene 5: photos, ken burns + internal crossfades ----
    photo_labels = []
    W2, H2 = round(W * 1.15), round(H * 1.15)
    for pi, fname in enumerate(PHOTO_FILES):
        idx = add_image_input(fname)
        raw = f"photo{pi}_raw"
        grd = f"photo{pi}_grd"
        filters.append(
            f"[{idx}:v]scale={W2}:{H2}:force_original_aspect_ratio=increase,crop={W2}:{H2},"
            f"zoompan=z='1+0.06*on/({PHOTO_FRAMES-1})':"
            f"x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={PHOTO_FRAMES}:s={W}x{H}:fps={FPS},setsar=1[{raw}]"
        )
        filters.append(grade(raw, grd))
        photo_labels.append(grd)

    photo_dur = PHOTO_FRAMES / FPS
    cur = photo_labels[0]
    running = photo_dur
    for pi in range(1, len(photo_labels)):
        nxt_label = f"scene5_x{pi}"
        offset = r(running - PHOTO_XFADE)
        filters.append(
            f"[{cur}][{photo_labels[pi]}]xfade=transition=fade:duration={PHOTO_XFADE}:offset={offset}[{nxt_label}]"
        )
        cur = nxt_label
        running = r(running + photo_dur - PHOTO_XFADE)
    scene_labels.append(cur)
    scene_durs.append(running)

    # ---- chain scenes with scene-transition crossfades ----
    cur = scene_labels[0]
    running = scene_durs[0]
    for i in range(1, len(scene_labels)):
        nxt_label = f"joined{i}"
        offset = r(running - SCENE_XFADE)
        filters.append(
            f"[{cur}][{scene_labels[i]}]xfade=transition=fade:duration={SCENE_XFADE}:offset={offset}[{nxt_label}]"
        )
        cur = nxt_label
        running = r(running + scene_durs[i] - SCENE_XFADE)

    total_dur = running
    fadeout_st = r(total_dur - 0.5)
    filters.append(f"[{cur}]fade=t=out:st={fadeout_st}:d=0.5:color={BG}[vout]")

    filter_script_path = os.path.join(TMP, "filter_complex.txt")
    with open(filter_script_path, "w", encoding="utf-8") as f:
        f.write(";\n".join(filters))

    print(f"Total duration ~= {total_dur:.3f}s ({len(filters)} filter nodes, {len(inputs)} inputs)")

    # ---- build ffmpeg input args ----
    input_args = []
    for path, extra in inputs:
        input_args += extra + ["-i", path]

    target_bits = TARGET_MB * 8 * 1024 * 1024 * SAFETY
    target_bitrate = int(target_bits / total_dur)
    maxrate = int(target_bitrate * 1.5)
    bufsize = int(target_bitrate * 2)
    print(f"Target video bitrate: {target_bitrate/1000:.0f} kbps (maxrate {maxrate/1000:.0f}k, bufsize {bufsize/1000:.0f}k)")

    passlog = os.path.join(TMP, "ffmpeg2pass")

    def run_pass(pass_no):
        cmd = [
            FFMPEG, "-y",
            *input_args,
            "-filter_complex_script", filter_script_path,
            "-map", "[vout]",
            "-r", str(FPS),
            "-c:v", "libx264",
            "-preset", "slow",
            "-pix_fmt", "yuv420p",
            "-b:v", str(target_bitrate),
            "-maxrate", str(maxrate),
            "-bufsize", str(bufsize),
            "-pass", str(pass_no),
            "-passlogfile", passlog,
            "-an",
            "-t", f"{total_dur:.4f}",
        ]
        if pass_no == 1:
            cmd += ["-f", "mp4", os.devnull if os.name != "nt" else "NUL"]
        else:
            cmd += ["-movflags", "+faststart", OUT]
        print("Running:", " ".join(f'"{c}"' if " " in c else c for c in cmd[:6]), "...")
        subprocess.run(cmd, check=True, cwd=ROOT)

    run_pass(1)
    run_pass(2)

    size_mb = os.path.getsize(OUT) / (1024 * 1024)
    print(f"Done: {OUT} ({size_mb:.2f} MB)")
    if size_mb > TARGET_MB:
        print("WARNING: output exceeds 15MB target", file=sys.stderr)


if __name__ == "__main__":
    main()
