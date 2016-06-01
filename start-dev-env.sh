#!/bin/bash
(trap - INT; exec npm run start) &
(trap - INT; exec lein server-headless) &
trap '' INT
wait
