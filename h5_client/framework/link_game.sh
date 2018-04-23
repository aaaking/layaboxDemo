#!/bin/sh

NAME=$1

if [ $# != 1 ] ; then 
echo "USAGE: $0 GAME_NAME" 
echo " e.g.: $0 shanxi_mj" 
exit 1; 
fi 

echo "LINK GAME:"${NAME}

if [ -d `pwd`/src/view/game/${NAME} ]; then
    unlink `pwd`/src/view/game/${NAME}
fi

if [ -d `pwd`/laya/assets/${NAME} ]; then
    unlink `pwd`/laya/assets/${NAME}
fi

if [ -d `pwd`/laya/pages/${NAME} ]; then
    unlink `pwd`/laya/pages/${NAME}
fi

if [ -d `pwd`/bin/res/audio/${NAME} ]; then
    unlink `pwd`/bin/res/audio/${NAME}
fi

if [ -d `pwd`/bin/res/audioweb/${NAME} ]; then
    unlink `pwd`/bin/res/audioweb/${NAME}
fi

if [ -d `pwd`/../${NAME}/src/ ]; then
    ln -s -f -v `pwd`/../${NAME}/src/ `pwd`/src/view/game/${NAME}
fi

if [ -d `pwd`/../${NAME}/res/ ]; then
    ln -s -f -v `pwd`/../${NAME}/res/ `pwd`/laya/assets/${NAME}
fi

if [ -d `pwd`/../${NAME}/page/ ]; then
    ln -s -f -v `pwd`/../${NAME}/page/ `pwd`/laya/pages/${NAME}
fi

if [ -d `pwd`/../${NAME}/audio/ ]; then
    ln -s -f -v `pwd`/../${NAME}/audio/ `pwd`/bin/res/audio/${NAME}
fi

if [ -d `pwd`/../${NAME}/audioweb/ ]; then
    ln -s -f -v `pwd`/../${NAME}/audioweb/ `pwd`/bin/res/audioweb/${NAME}
fi