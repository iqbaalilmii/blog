---
title: "Recovering Deleted Files from NTFS $MFT: Resident-File, ICC Tokyo 2025"
pubDate: "2025-11-20"
description: 'Walktrough of Resident-File Challenge from ICC Tokyo 2025'
---

![alt text](/images-resident-file/{3675EEBC-5C0A-407D-BD6B-11C5ED3411E6}.png)

NTFS's Master File Table (`$MFT`) enables recovery of deleted files, even when malware attempts to erase them. This walkthrough is based on the **Resident File** challenge from **ICC CTF 2025**, where solving the challenge required understanding *resident attributes* and extracting deleted file data directly from the $MFT.

---

## 1. NTFS Basics: Resident vs Non-Resident Data

Every file on an NTFS volume is represented as an entry in the Master File Table ($MFT). Each entry may contain:

- Metadata  
- File attributes  
- Pointers to external data clusters  
- **Or the file’s actual content**

Whether NTFS stores file content *inside the MFT entry* or *outside* depends on size:

### Resident Data
- Stored **inside the MFT entry itself**
- Typically applies to small files
- Fast access and minimal fragmentation

### Non-Resident Data
- File content stored in external clusters
- MFT only stores RUN lists (pointers)

Understanding this distinction is key to deleted file recovery.

---

## 2. What Happens When a File Is Deleted?

![alt text](/images-resident-file/426239_1_En_6_Fig4_HTML.png)
Image source: [Deleted File Recovery in FAT](https://link.springer.com/chapter/10.1007/978-3-030-00581-8_6)
_<p align="center">(this gives you a general overview of the deletion process, even though it may differ between file systems)</p>_


When a file is deleted:

1. NTFS marks the $MFT entry as **unused**
2. Directory references are removed
3. External clusters are marked free (if non-resident)
4. **Resident data remains intact inside the $MFT entry unless overwritten**

This persistence makes $MFT one of the richest sources for forensic recovery.

---

## 3. Finding Suspicious Activity

![alt text](/images-resident-file/image.png)

Prefetch analysis revealed a suspicious executable:

- `onedrivesetup.exe`
- A deleted copy named: `$R5X6D2I.exe`

Upon Decompiling the malware we can conclude its behavior:
- created `.icc` encrypted files and deleted originals
- prepend "Data is Encrypted" string to the encrypted file

```dotnet
		Using fileStream As FileStream = File.Open(text + ".icc", FileMode.Create)
			Dim bytes As Byte() = Encoding.UTF8.GetBytes("Data is Encrypted.")
			Dim source As IEnumerable(Of Byte) = memoryStream.ToArray().Skip(2)
			Dim <>9__0_ As Func(Of Byte, Byte) = Program.<>c.<>9__0_0
			Dim selector As Func(Of Byte, Byte) = <>9__0_
			If <>9__0_ Is Nothing Then
				Dim func As Func(Of Byte, Byte) = Function(e As Byte) e Xor 127
				selector = func
				Program.<>c.<>9__0_0 = func
			End If
```

This indicated a malware-like dropper encrypting Documents and replacing them with `.icc` files.

Thus, examining the $MFT for deleted file traces was the logical next step.

---

## 4. Extracting Deleted File From $MFT

Based on the given distribution file, it seems like that we need to recover the deleted ransom files.

we searched for deleted `.icc` entries and the prenpended strings directly to the `$MFT` blob.

![alt text](/images-resident-file/{0EEE4FD6-6D1C-4BC5-B5B0-9D1926E0D881}.png)

Even though the file itself was removed, the **resident data blob was still present in the $MFT**.

This is exactly how NTFS resident recovery becomes invaluable.

---

## 5. Reconstructing and Decrypting the File

After extracting the resident binary blob and saving it as `flag2.txt.icc`, we analyzed its structure:

![alt text](/images-resident-file/{FFA40CC1-C1B9-47DB-B09A-AF0A7B2944C6}.png)

```
[Header] "Data is Encrypted."
[Ciphertext] AES-CBC encrypted payload
[Key] 32-byte AES key appended at end
```

Using this structure, we built a decryptor:

```python
from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import unpad
import gzip

HEADER = b"Data is Encrypted."
KEY_LEN = 32
IV = b"[Null byte]" * 16

def decrypt_file(path):
    with open(path, "rb") as f:
        data = f.read()

    key = data[-KEY_LEN:]
    ciphertext = data[len(HEADER):-KEY_LEN]

    cipher = AES.new(key, AES.MODE_CBC, IV)
    decrypted = unpad(cipher.decrypt(ciphertext), AES.block_size)

    xored = bytes(b ^ 127 for b in decrypted)

    original = gzip.decompress(b"" + xored)

    with open(path + ".decrypted", "wb") as o:
        o.write(original)

    print("Recovered:", path + ".decrypted")
```

Running it successfully recovered the original document and the challenge flag.

---

## 6. Key Takeaways

### ✔ Deleted does **not** mean destroyed  
Resident file content often survives deletion intact.

### ✔ NTFS resident attributes are extremely recoverable  
Small malicious artifacts, logs, and metadata often remain inside $MFT.

### ✔ $MFT is essential in forensic workflows  
Even if an attacker wipes files, NTFS structures may silently preserve them.

### ✔ Resident data can store entire encrypted payloads  
As seen in this challenge, the `.icc` file’s ciphertext and encryption key were *all preserved* inside the MFT entry.

---
