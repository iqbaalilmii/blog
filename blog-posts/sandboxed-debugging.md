---
title: "Windows Sandbox Memory Dump Analysis - Cyber Jawara National 2024 Final Round"
pubDate: "2025-05-04"
description: 'Proof-of-Concept of a challenge I crafted for the Cyber Jawara National 2024 Final Round'
---
This is a walkthrough of a memory forensics challenge called "sandboxed debugging," that i designed for the Cyber Jawara National 2024 Final Round. The goal is to analyze a memory dump from a Windows Sandbox, identify a malicious process, uncover its encryption method, and decrypt its network traffic to retrieve a flag. Let’s dive into the solution!

### Scenario
Prof. Darmodar and his student Jono were researching on a Windows instance when Prof. Darmodar’s wife, Chizuru, spilled coffee on the PC, frying it. Fortunately, a memory dump was captured before the crash. Your task is to analyze this dump and extract critical information.

#### Challenge Objectives
- Identify the Malicious Process: Find the rogue process hiding in the memory dump.
- Determine Encryption Method: Figure out how the malware encrypts its network traffic.
- Decrypt the Traffic: Use the encryption details to decode the traffic and extract the flag.

`Note: Traditional tools like Volatility won’t work due to symbol mismatches, so we’ll rely on MemprocFS, a hex editor, and WinDbg.`

#### Tools Required
- MemProcFS: Mounts the memory dump as a file system for analysis. (https://github.com/ufrisk/MemProcFS)
- Hex Editor: Allows manual inspection of raw memory data.
- WinDbg: Analyzes minidumps extracted from the memory.
Basic knowledge of memory forensics and Windows internals is also helpful.

### Step-by-Step Solution

#### Step 1: Mount the Memory Dump
Use MemprocFS to mount the memory dump file (e.g., named mem) and explore it as a virtual file system.
Command:
`memprocfs -device mem -forensic 4`

For this guide, assume it’s mounted to the M: drive.
#### Step 2: Review Recent Processes
Navigate to `M:\timeline\timeline_process.txt` to view a timeline of processes that were running. Look for anything unusual in the context of a Windows Sandbox environment.
#### Step 3: Identify the Malicious Process
In the timeline, you’ll notice `splwow32.exe` launched from `C:\Windows` by a user, not the system. While splwow32.exe is a legitimate process, user-initiated execution in a sandbox is suspicious and suggests malware (not by `SYSTEM` or `NETWORK`). The original malware file is corrupted and not in RAM, so we’ll need to dig deeper.
#### Step 4: Analyze Minidumps
Explore minidumps in `M:\name` to uncover clues about the malware’s behavior.

##### Analyzing the splwow32.exe Minidump
Open the minidump for `splwow32.exe-3056` in WinDbg (or you can analyze its blob/raw data).
Check the loaded modules—evidence reveals it’s Python-based malware disguised as a legitimate process.
Use WinDbg or a hex editor to extract details about its encryption mechanism.

##### Analyzing the `wireshark.exe` Minidump
Open the `wireshark.exe` minidump in WinDbg (or you can analyze its blob/raw data).
Extract the captured network traffic data.
Apply the encryption details from the `splwow32.exe` analysis to decrypt the traffic and reveal the flag.

#### Step 5: Alternative Analysis Techniques
If needed, try these additional methods:
- mftparser: Examine file system metadata for more context.
- Hex Editor: Search raw memory for encryption patterns or strings.

### Conclusion
By mounting the dump with MemprocFS, identifying `splwow32.exe` as the malicious process, and analyzing minidumps with WinDbg, you can decrypt the network traffic and retrieve the flag. This challenge tests your ability to adapt and use creative forensic techniques!
asics.
