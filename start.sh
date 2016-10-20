#!/bin/sh

if [ -n "${DISK_PATH}" -a ! -f "${DISK_PATH}" ]; then
	echo -n 0 > ${DISK_PATH}
	chown app ${DISK_PATH}
fi

gosu app npm start
