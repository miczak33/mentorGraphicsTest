
title Railo 4.2

"jre/bin/java" -DSTOP.PORT=8887 -DSTOP.KEY=railo -javaagent:lib/ext/railo-inst.jar -jar start.jar --module=http jetty.port=8888
