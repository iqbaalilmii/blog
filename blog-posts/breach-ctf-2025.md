---
title: "BreachCTF 2025 -  Onions Make Me Cry :("
pubDate: "2025-04-06"
description: 'Onions Make Me Cry :( challenge writeup from BreachCTF 2025'
---

i got the first blood in this chall 🩸
<img src="https://hackmd.io/_uploads/SkyimuJCJe.png" alt="{23EBD98B-BFD5-4146-81A5-3C6C18765C38}" width="300"/>

in this chall you are given a .pcapng file with objective to analyze the network and find the TOR related IP address.

first of all, lemme explain what is a Tor. Tor is a distributed overlay network designed to anonymize low-latency TCP-based applications such as web browsing, secure shell, and instant messaging. Clients choose a path through the network and build a circuit*, in which each node (or onion router* or OR*) in the path knows its predecessor and successor, but no other nodes in the circuit. Traffic flowing down the circuit is sent in fixed-size cells*, which are unwrapped by a symmetric key at each node (like the layers of an onion) and relayed downstream. (sc: https://wiki.wireshark.org/Tor)

this challenge says that we need to find out ip related to that node (or onion router).

from this article (https://osqa-ask.wireshark.org/questions/13590/tor-detection/) we know that TOR is running at port 9001 and 9030. but if we take a look at the pcap we wont find a network related to that port. but from the same article we know that TOR has weird dns that appear in its certificate handshake process.

![{7BB9EF40-8780-43CC-BFB4-12047D57B98B}](https://hackmd.io/_uploads/HyiwV_yRkg.png)

we can use that to try to find out which IP that try to proceed handshake with the client that had some weird dns that looked like that.

we can use wireshark filter `ssl.handshake` to find any packets related to ssl handshake process

![image](https://hackmd.io/_uploads/BkdvrOJRJg.png)
and its true, that kind of handshake process with weird dns did exist. so we need just take it out, sort it, and submit it as flag

`Breach{87.236.194.23 95.216.33.30 185.225.114.53 185.241.208.163 212.227.74.176}`