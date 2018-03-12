SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
chmod a+x $SCRIPTPATH/node_modules/p5/lib/p5.d.ts
sed -e '10315s/.*/    amp(volume: number|object, rampTime?: number, timeFromNow?: number): AudioParam/' -i $SCRIPTPATH/node_modules/p5/lib/p5.d.ts
