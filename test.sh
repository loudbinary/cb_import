#!/usr/bin/env bash
export BUCKET_MEMORY=$($(free -m|awk '/^Mem:/{print int($2)}') - $(free -m|awk '/^Mem:/{print int($2 * 0.80)}'))