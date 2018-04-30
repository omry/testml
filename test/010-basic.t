#!/usr/bin/env testml-boot

*input.undent.compile == *output

=== Basic comments, assignment, assertions and data
--- input
    # A simple testml file

    # For test frameworks that support planning:
    Plan = 3


    # Assertion loops:
    *input.get-sha1 == *sha1
    *input.get-md5 == *md5


    # Test data blocks:
    === Test 1
    --- input: I like pie.
    --- sha1: 5f30adb9864439315a33e1a6631358164f94cc20

    === Test 2
    --- input
    I like pie.
    --- sha1: 53b3de1f1d480989d391f24a8886d291773347a7
    --- md5: 29a529ed285c7f5cd6c3bff4b3bb7626

--- output
{ "testml": "0.3.0",
  "code": ["=>",[],
    ["=","Plan",3],
    ["==",
      [".",
        ["*","input"],
        ["get-sha1"]],
      ["*","sha1"]],
    ["==",
      [".",
        ["*","input"],
        ["get-md5"]],
      ["*","md5"]]],
  "data": [
    { "label": "Test 1",
      "point": {
        "input": "I like pie.",
        "sha1": "5f30adb9864439315a33e1a6631358164f94cc20"}},
    { "label": "Test 2",
      "point": {
        "input": "I like pie.\n",
        "sha1": "53b3de1f1d480989d391f24a8886d291773347a7",
        "md5": "29a529ed285c7f5cd6c3bff4b3bb7626"}}]}

# vim: ft=:
