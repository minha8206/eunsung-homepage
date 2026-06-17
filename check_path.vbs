
Set fso = CreateObject("Scripting.FileSystemObject")
Set wsh = CreateObject("WScript.Shell")

Dim onedrive
onedrive = wsh.ExpandEnvironmentStrings("%OneDrive%")
If onedrive = "%OneDrive%" Then
    onedrive = wsh.ExpandEnvironmentStrings("%OneDriveConsumer%")
End If

Dim result
result = "OneDrive=" & onedrive & vbCrLf

Set f = fso.OpenTextFile("C:\Users\user-pc\Claude\Projects\cowork\vbs_result.txt", 2, True)
f.Write result
f.Close
