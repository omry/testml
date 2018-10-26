#! bash

set -e -u -o pipefail

TestML.Run.tester() { echo TestML.Run.Tap; }

TestML.Run.Tap.testml-begin() {
  TestML_Run_Tap_count=0
}

TestML.Run.Tap.testml-end() {
  echo "1..${TestML_Run_Tap_count}"
}

TestML.Run.Tap.testml-eq() {
  : $((TestML_Run_Tap_count++))

  local got=$1
  local want=$2
  local label=${3-}

  if [[ $got == "$want" ]]; then
    echo "ok ${TestML_Run_Tap_count}${label}"

  else
    echo "not ok ${TestML_Run_Tap_count}${label}"

    if [[ -z ${NO_DIFF-} && $want =~ $'\n' ]]; then
      dir=$(mktemp -d)
      echo -n "$got" > "$dir/got"
      echo -n "$want" > "$dir/want"
      diff -u "$dir/want" "$dir/got" |
        sed 's/^/# /' || true >&2

    else
      (
        echo "         got: '$got'"
        echo "    expected: '$want'"
      ) | sed 's/^/# /' || true >&2
    fi
  fi
}