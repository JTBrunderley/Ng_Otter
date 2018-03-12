SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
chmod a+x $SCRIPTPATH/node_modules/p5/lib/p5.d.ts
sed -i '10315s/.*/    amp(volume: number|object, rampTime?: number, timeFromNow?: number): AudioParam/' $SCRIPTPATH/node_modules/p5/lib/p5.d.ts
