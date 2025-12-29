---
title: "Blindly Guessing and Solving the Minidump Challenge - Bad OPSEC Write-up"
pubDate: "2025-12-29"
description: 'Bad OPSEC write-up - Cyber Jawara National 2025 [CSIRT]'
---

## Forensics / Bad OPSEC

```py
from pwn import *
import struct

p = remote('gzcli.ctf.cyberjawara.id', 33955)
p.recv()

ans = [
    'Windows 10 Version 19043 MP DESKTOP-LCC9E2D',
    'C:\\Users\\USER\\Music\\Kaspersky.exe',
    'rnicrosoft',
    'C:\\Users\\USER\\DokumenPenting',
    '!h0peth3r34ren0m0r3ch34t!n94ft3rth15CTF',
]

for i in ans:
    p.sendline(i.encode())
    print(p.recv())
    print("\n")
```

```text
# b'Correct!\n\n======================================================================\nINVESTIGATION COMPLETE!\n======================================================================\n\nGG!\n\nFlag: CJ2025{th!s_is_the_beg1nnin9_0f_y0ur_4n4lysis_on_aPT_gr0up_a.k.a_as3ng_Persistent_Threat_anyway_the_malware_sucks_sorry}\n\n======================================================================\n'
```

Q1:  
![](/images-blindly/image1.png)
Device name: just use HxD.  

![](/images-blindly/image2.png)  

Q2?  
![](/images-blindly/image3.png)  

Q3? Typosquatting at its finest.  
Search the global mutex; use `Global\\` (HxD again).  

![](/images-blindly/image4.png)

Q4? Encrypted directory? Just search for `.aseng` (HxD again).  
![](/images-blindly/image5.png)  

Q5? Dump → rev.  
Search for the CT in the minidump.  
(Before this, we already know the binary imports both AES and RC4.) 

![](/images-blindly/image6.png)

And the CT also resides in the minidump (of course, since this minidump was likely taken right after the malware was run).  
![](/images-blindly/image7.png)

I tried dumping `Kaspersky.exe`, but I got junk instead of a valid binary. 

That confused me, so I went back to the minidump. From the information we had, the algorithms and keys should be in there. (Around this time, Hanzo was also working on it and solved it before I did.)

While extracting anything that looked useful, `bulk_extractor` managed to pull an AES key from it.

![](/images-blindly/image8.png)

So, we have the key — we can try to decrypt it.  
![](/images-blindly/image9.png)

And I was confused again.

Why wouldn’t it work?  
Then I remembered: the encryption routine comes from aseng’s own mutex, and it uses two algorithms.

This wild assumption was confirmed by this:  
![](/images-blindly/image10.png)

There’s a blob with the same length as the CT we had. I tried decrypting that one, and it worked.

![](/images-blindly/image11.png)

So the remaining problem was the IV. How do we find the correct IV?

Usually the IV is 16 bytes.  

I searched for the key in the minidump and found several hits; one of them looked like this:

![](/images-blindly/image12.png)

The key seems to be appended with something.  

`BD49554F E4082AF9 953A5A18 27DA74B5 B8D30DF0 D3A5C5C6 24A278A3 15714474`
(it was 32 bytes)

We know the encryption happens twice, so this should be it:  

`BD49554FE4082AF9953A5A1827DA74B5`  
`B8D30DF0D3A5C5C624A278A315714474`

![](/images-blindly/image13.png)

And the 2nd row was the correct IV for the AES!

This explains everything

![](/images-blindly/image14.png)

This row:  

```
C6B225F5 C3A522BC 835396E5 DC61C7E0 7CFB86D5 2F1596A7 D0F6E257 8EE99547 41D1934F 53200EE0 C534980F C06F6CC5 040EDE65 D179220C 1CFC1593 8ECDF69A BD49554F E4082AF9 953A5A18 27DA74B5 B8D30DF0 D3A5C5C6 24A278A3 15714474
```

It was:  

`rc4Key : aesKey : **I still don’t know what the purpose of this is** : aesIV`
 