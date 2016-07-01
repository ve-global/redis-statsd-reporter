'use strict';

module.exports = `# Server
redis_version:3.2.1
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:62a67eec83b28403
redis_mode:standalone
os:Darwin 15.2.0 x86_64
arch_bits:64
multiplexing_api:kqueue
gcc_version:4.2.1
process_id:6170
run_id:e26f969c28b5579e1695d06c97bd035202a08774
tcp_port:6379
uptime_in_seconds:5
uptime_in_days:0
hz:10
lru_clock:7768024
executable:/Users/aroyle/Documents/repos/redis-server
config_file:

# Clients
connected_clients:0
client_longest_output_list:0
client_biggest_input_buf:0
client_total_writes_outstanding:0
client_total_sent_bytes_outstanding:0
blocked_clients:0

# Memory
used_memory:1580669864
used_memory_human:1.47G
used_memory_rss:1504800768
used_memory_rss_human:1.40G
used_memory_peak:6405244320
used_memory_peak_human:5.97G
used_memory_lua:36864
maxmemory:13100000000
maxmemory_human:12.20G
maxmemory_policy:volatile-lru
mem_allocator:jemalloc-3.6.0

# Stats
total_connections_received:9229877
total_commands_processed:1529344074
instantaneous_ops_per_sec:9
bytes_received_per_sec:1159
bytes_sent_per_sec:5944
bytes_received_per_sec_human:1.13K
bytes_sent_per_sec_human:5.80K
instantaneous_input_kbps: 1.159
instantaneous_output_kbps: 5.944
rejected_connections:0
expired_keys:15184334
evicted_keys:0
keyspace_hits:451247011
keyspace_misses:112485578
pubsub_channels:0
pubsub_patterns:0
total_oom_messages:0
sync_full:0
sync_partial_ok:0
sync_partial_err:0
latest_fork_usec:0
migrate_cached_sockets:0

# Replication
role:master

# CPU
used_cpu_sys:57564.19
used_cpu_user:46803.36
used_cpu_avg_ms_per_sec:0
server_load:1.36
event_wait:36
event_no_wait:786
event_wait_count:45
event_no_wait_count:47

# Cluster
cluster_enabled:1
cluster_myself_name:0aea5219ffc4a0711cc027da68b259f54e296508

# Keyspace
db0:keys=127,expires=100,avg_ttl=123
`;
