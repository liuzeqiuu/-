# 需要bash
# 需要配置ssh authorized_keys
# ssh-copy-id -i path_to_your_id_file.pub root@47.74.190.154 
# test with 'ssh root@47.74.190.154'
# 如果依然需要密码 请google解决
mv dist mall.bityuan.com
tar -czf mall.bityuan.com.tar mall.bityuan.com
rm -rf mall.bityuan.com
scp mall.bityuan.com.tar root@47.74.190.154:/usr/share/nginx/mall.bityuan.com.tar
rm -rf mall.bityuan.com.tar
ssh root@47.74.190.154 'cd /usr/share/nginx/ && rm -rf mall.bityuan.com && tar -xzf mall.bityuan.com.tar && rm -rf mall.bityuan.com.tar'
echo 'done. 👉 http://47.74.190.154:8084/'
# 清理分支
# git remote prune origin