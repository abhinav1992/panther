using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using OnlineGame.API.Constants;
using OnlineGame.API.Models;
using OnlineGame.Cache;
using OnlineGame.Cache.Helpers;
using StackExchange.Redis;

namespace OnlineGame.API.Hubs
{
    public class GameZoneHub : Hub
    {
        StackExchange.Redis.IDatabase _cacheDatabase;
        public GameZoneHub()
        {
            _cacheDatabase = RedisConnectionHelper.RedisConnection.GetDatabase();
        }
        public void Hello()
        {
            Clients.All.hello();
        }

        public void Join(string name)
        {
            //Add the online user to cache
            bool saved = AddOnlineUser(Context.ConnectionId, name);   
            if (!saved)
                Clients.Client(Context.ConnectionId).joined(false);
            else
                Clients.Client(Context.ConnectionId).joined(true);
        }

        public void Unjoin(string name)
        {
            RemoveOnlineUser(Context.ConnectionId);
        }

        public void UpdateScore(string name, int score)
        {
            //Add the score
            List<UserScore> userScores = AddScore(name, score);
            Clients.All.scoreUpdate(userScores);
        }

        public void GetUpdatedScore()
        {
            List<UserScore> userScores = GetUserScores();
            Clients.Client(Context.ConnectionId).scoreUpdate(userScores);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            //Remove online user from cache
            RemoveOnlineUser(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        private bool AddOnlineUser(string connectionId, string name)
        {
            RedisValue[] onlineUsers = _cacheDatabase.ListRangeAsync(RedisConstants.LIST_ONLINE_USER).Result;
            if (onlineUsers.Any(u => u.ToString() == name))
            {
                //The user already there
                return false;

            }
            //Add user in users set 
            _cacheDatabase.ListRightPush(RedisConstants.LIST_ONLINE_USER, name);
            //Add a mapping between users and connection id in online_users set
            List<HashEntry> entries = new List<HashEntry>();
            entries.Add(new HashEntry(RedisConstants.USER_NAME, name));
            entries.Add(new HashEntry(RedisConstants.CONNECTION_ID, connectionId));
            _cacheDatabase.HashSet(string.Format("{0}:{1}", RedisConstants.USER_CONNECTION_KEY_PREFIX, connectionId), entries.ToArray());
            return true;
            
        }

        private void RemoveOnlineUser(string connectionId)
        {
            
            string hashKey = string.Format("{0}:{1}", RedisConstants.USER_CONNECTION_KEY_PREFIX, connectionId);
            //Get the record of current connection id from hash
            var hash = _cacheDatabase.HashGetAllAsync(hashKey).Result;
            if (hash.Length > 0)
            {
                string username = string.Empty;
                foreach (var entry in hash)
                {
                    if (entry.Name == "name")
                    {
                        username = entry.Value;
                    }
                }
                //Remove user from users set 
                _cacheDatabase.ListRemove(RedisConstants.LIST_ONLINE_USER, username);
                //Add a mapping between users and connection id in online_users set
                _cacheDatabase.HashDelete(hashKey, new RedisValue[] { hash[0].Name, hash[1].Name });
                //Remove related score
                bool removed = _cacheDatabase.SortedSetRemove(RedisConstants.SCORES, username);
                if (removed)
                {
                    List<UserScore> userScores = GetUserScores();
                    Clients.All.scoreUpdate(userScores);
                }
                
            }
        }

        private RedisValue GetRedisValueForUser(OnlineUser user)
        {
            RedisValue redisValue = new RedisValue();
            redisValue = JsonConvert.SerializeObject(user);
            return redisValue;
        }

        private List<UserScore> AddScore(string name, int score)
        {
            string key = RedisConstants.SCORES;
            //Add the record to Sorted Set
            SortedSetEntry sortedSetEntry = new SortedSetEntry(name, score);
            _cacheDatabase.SortedSetAdd(key, new SortedSetEntry[] { sortedSetEntry });

            var scores =_cacheDatabase.SortedSetRangeByRankWithScores(key, order: Order.Descending);

            return GetUserScores();
        }

        private List<UserScore> GetUserScores()
        {
            string key = RedisConstants.SCORES;
            var scores = _cacheDatabase.SortedSetRangeByRankWithScores(key, order: Order.Descending);

            List<UserScore> userScores = new List<UserScore>();
            foreach (var sc in scores)
            {
                UserScore userScore = new UserScore { User = sc.Element, Score = Convert.ToInt32(sc.Score) };
                userScores.Add(userScore);
            }
            return userScores;
        }
    }
}