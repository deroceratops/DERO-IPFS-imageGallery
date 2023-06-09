Function Initialize() Uint64
10 IF EXISTS("owner") THEN GOTO 100
20 STORE("owner", SIGNER())
30 STORE("cidCount", 0)
99 RETURN 0
100 RETURN 1
End Function

// TODO: Add validation to check if
// the IPFS CID already exists.
Function AddIpfsCID(cid String) Uint64
20 DIM cidCount as Uint64
30 LET cidCount = LOAD("cidCount")
40 STORE("cid_" + cidCount, cid)
50 STORE("cidCount", cidCount + 1)
60 RETURN 0
End Function
