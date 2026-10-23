/**
 * Reading a Windows ACL as SDDL, so the same answer comes on every language
 * of Windows, and on a Mac where the tests of the reading itself run too.
 */
import { deepStrictEqual, strictEqual, throws } from "node:assert/strict";
import { test } from "node:test";

import { describe, othersAllowed, sddlFromSave, sidFromWhoami } from "../dist/winacl.js";

const ME = "S-1-5-21-1111111111-2222222222-3333333333-1001";

test("a folder in the user's profile, as Windows makes it, is private", () => {
  deepStrictEqual(othersAllowed(`D:AI(A;OICIID;FA;;;SY)(A;OICIID;FA;;;BA)(A;OICIID;FA;;;${ME})`, ME), []);
  deepStrictEqual(othersAllowed(`D:PAI(A;OICI;FA;;;${ME})`, ME), []);
  deepStrictEqual(othersAllowed(`D:P(A;OICI;FA;;;S-1-5-18)(A;OICI;FA;;;S-1-5-32-544)(A;OICIIO;GA;;;CO)(A;OICI;FA;;;${ME})`, ME), []);
});

test("anyone else let in is named, even by an entry that only passes down to what is inside", () => {
  // a folder on a second drive, the way Windows sets up D:\
  deepStrictEqual(
    othersAllowed(`D:AI(A;OICIID;FA;;;BA)(A;OICIID;FA;;;SY)(A;OICIIOID;SDGXGWGR;;;AU)(A;ID;0x1301bf;;;AU)(A;OICIID;0x1200a9;;;BU)`, ME),
    ["AU", "BU"],
  );
  deepStrictEqual(othersAllowed(`D:(A;OICI;FR;;;WD)(A;OICI;FA;;;${ME})`, ME), ["WD"]);
  deepStrictEqual(othersAllowed(`D:(A;OICI;FA;;;S-1-5-21-1111111111-2222222222-3333333333-1002)(A;;FA;;;${ME})`, ME), [
    "S-1-5-21-1111111111-2222222222-3333333333-1002",
  ]);
});

test("the built-in Administrator is written LA, and is this account when it runs as it", () => {
  const admin = "S-1-5-21-3776380004-1005456608-3524014338-500";
  deepStrictEqual(othersAllowed("D:PAI(A;OICI;FA;;;LA)", admin), []);
  deepStrictEqual(othersAllowed("D:PAI(A;OICI;FA;;;LA)", ME), ["LA"]);
  deepStrictEqual(othersAllowed("D:PAI(A;OICI;FA;;;LG)", "S-1-5-21-1-2-3-501"), []);
});

test("deny entries only take away and are not counted", () => {
  deepStrictEqual(othersAllowed(`D:P(D;OICI;FA;;;WD)(A;OICI;FA;;;${ME})`, ME), []);
});

test("no access control at all, or no DACL, is open to everyone", () => {
  deepStrictEqual(othersAllowed("D:NO_ACCESS_CONTROL", ME), ["everyone (no access control)"]);
  deepStrictEqual(othersAllowed("O:BAG:SY", ME), ["everyone (no ACL)"]);
});

test("an owner and group before the DACL do not confuse it", () => {
  deepStrictEqual(othersAllowed(`O:${ME}G:S-1-5-21-1-2-3-513D:PAI(A;OICI;FA;;;${ME})(A;OICI;FR;;;BU)`, ME), ["BU"]);
});

test("the groups a person would recognise are named as they know them", () => {
  strictEqual(describe(["WD", "AU", "S-1-5-32-545", "S-1-5-21-9-9-9-1002"]), "Everyone, Authenticated Users, Users, S-1-5-21-9-9-9-1002");
});

test("the account's SID is read from whoami, whatever the language of its name", () => {
  strictEqual(sidFromWhoami(`"desktop-7q1\\\\пользователь","${ME}"\r\n`), ME);
  throws(() => sidFromWhoami("ERROR: access denied"), /SID/);
});

test("what icacls /save writes is read in UTF-16 and in plain text", () => {
  const saved = `profiles\r\nD:AI(A;OICIID;FA;;;SY)(A;OICIID;FA;;;${ME})\r\n`;
  const sddl = `D:AI(A;OICIID;FA;;;SY)(A;OICIID;FA;;;${ME})`;
  strictEqual(sddlFromSave(Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(saved, "utf16le")])), sddl);
  strictEqual(sddlFromSave(Buffer.from(saved, "utf16le")), sddl);
  strictEqual(sddlFromSave(Buffer.from(saved, "utf8")), sddl);
  throws(() => sddlFromSave(Buffer.from("profiles\r\n", "utf8")), /no ACL/);
});
