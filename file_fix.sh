SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
sed -i '10315s/.*/    amp(volume: number|object, rampTime?: number, timeFromNow?: number): AudioParam/' $SCRIPTPATH/node_modules/p5/lib/p5.d.ts
