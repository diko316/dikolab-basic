#!/bin/sh -e

CURRENT_OUTPUT=
CMD_PID=

command_output() {
  cat <<CMD_OUTPUT || return $?
$(eval $@ 2>&1)
CMD_OUTPUT

}

command_show_if() {
  local NEW_OUTPUT

  NEW_OUTPUT=$(command_output $@)

  if [ "[${NEW_OUTPUT}]" != "[${CURRENT_OUTPUT}]" ]; then
    CURRENT_OUTPUT="${NEW_OUTPUT}"
    cat <<CMD_OUTPUT
${NEW_OUTPUT}
CMD_OUTPUT

  fi
}

while true; do
  
  command_show_if $@
  sleep 1

done
