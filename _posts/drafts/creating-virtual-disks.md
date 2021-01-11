---
id: 9568a84a-e716-464a-9a87-e5be0ad97037
title: Creating Virtual Disks with powershell
draft: true
---

```pwsh
New-VHD -Path 'C:\some\path\name.vhdx' -Dynamic -SizeBytes 30GB

Get-DiskImage -ImagePath C:\some\path\name.vhdx # Returns disk number

Initialize-Disk  -Number 2 -PartitionStyle GPT

New-Partition -DiskNumber 2 -AssignDriveLetter -UseMaximumSize | Format-Volume -FileSystem NTFS -NewFileSystemLabel "HackTheBox" -Confirm:$False

Mount-VHD -Path C:\some\path\name.vhdx

Dismount-VHD -Path C:\some\path\name.vhdx
```

`-Dynamic` creates a dynamic disks
