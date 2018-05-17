#!/bin/sh
switchtolocation() {
  currentlocation=`networksetup -getcurrentlocation`
  if test $currentlocation = $1; then
    return
  fi
  scselect `scselect|grep ${1}|cut -b 4-40`
  osascript -e 'display notification "'"ネットワーク環境を「${1}」へ変更しました。"'" with title "'"${0##*/}"'" subtitle "'"${2}"'"'
}

ADAPTER="en0"

airportpower=`networksetup -getairportpower ${ADAPTER}|cut -d' ' -f4`
if test ${airportpower} = 'Off'; then
  echo 'Wifi is Off.'
  exit
fi

SSID=`networksetup -getairportnetwork ${ADAPTER}|cut -d':' -f2|cut -b 2-`
case "$SSID" in
  "nekoyashiki26")
    switchtolocation "MY-HOME" ${ssid}
    ;;
   "AirPort31444")
    switchtolocation "MY-HOME" ${ssid}
    ;;
  "mlab")
    switchtolocation "LAB" ${ssid}
    ;;
  "KIT-WLAP2")
    switchtolocation "KIT-WLAP2" ${ssid}
    ;;
  "ou are not associated with an AirPort network.")
    echo 'wifi not connect'
    ;;
  *)
    switchtolocation "Automatic" ${ssid}
    ;;
esac


