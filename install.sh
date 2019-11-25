#!/usr/bin/env bash 

set -eu

PKT_FWD_USERNAME=lora-pkt-fwd

# ensure we're running with root permissions
if [ $(id -u) != 0 ]; then
    echo This script requires root privileges
    exit 1
fi

echo Creating non-login user

if [ -e $(id -u "$PKT_FWD_USERNAME" 2>/dev/null) ]; then
    useradd -M -s /bin/false "$PKT_FWD_USERNAME"
    usermod -aG dialout "$PKT_FWD_USERNAME" 
fi


# Install LoRaWAN packet forwarder repositories
INSTALL_DIR="./"
if [ ! -d "$INSTALL_DIR" ]; then mkdir $INSTALL_DIR; fi
pushd $INSTALL_DIR

apt update -y 

# To install PostgreSQL
apt install postgresql -y -f
apt install python-psycopg2 -y -f
sudo -u postgres psql template1 -f init.sql

apt-get install -y python-setuptools
apt-get install -y python-dev
apt-get install -y libffi-dev
apt-get install -y libssl-dev
python setup.py install --record files.txt
## for uninstall
## cat files.txt | xargs rm -rf

pushd floranet/data
alembic upgrade head
popd

# floranet -c [config] -f -l [logfile] -d

cp -f ./config/database.cfg  /etc/lora_pkt_fwd/
cp -f ./lora_network_server.service /etc/systemd/system/lora_network_server.service
cp -r ./floranet/web /etc/lora_pkt_fwd/

systemctl enable lora_network_server
systemctl start lora_network_server

