SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
echo $SCRIPTPATH
sed -e '10315s/.*/    amp(volume: number|object, rampTime?: number, timeFromNow?: number): AudioParam/' -i $SCRIPTPATH/node_modules/p5/lib/p5.d.ts
