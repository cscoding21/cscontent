#!/bin/bash

npx prisma format
npx prisma db push --force-reset && npx prisma db push
npx prisma generate