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
            AddOnlineUser(Context.ConnectionId, name);   
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            //Remove online user from cache
            return base.OnDisconnected(stopCalled);
        }

        private void AddOnlineUser(string connectionId, string name)
        {
            //Add user in users set 
            _cacheDatabase.ListRightPush(RedisConstants.LIST_ONLINE_USER, name);
            //Add a mapping between users and connection id in online_users set
            List<HashEntry> entries = new List<HashEntry>();
            entries.Add(new HashEntry(RedisConstants.USER_NAME, name));
            entries.Add(new HashEntry(RedisConstants.CONNECTION_ID, connectionId));
            _cacheDatabase.HashSet(string.Format("{0}:{1}", RedisConstants.USER_CONNECTION_KEY_PREFIX, connectionId), entries.ToArray());
        }

        private void RemoveOnlineUser(string connectionId, string name)
        {
            //Add user in users set 
            _cacheDatabase.ListRemove(RedisConstants.LIST_ONLINE_USER, name);
            //Add a mapping between users and connection id in online_users set
            _cacheDatabase.HashDelete(string.Format("{0}:{1}", RedisConstants.USER_CONNECTION_KEY_PREFIX, connectionId), string.Empty);
        }

        private RedisValue GetRedisValueForUser(OnlineUser user)
        {
            RedisValue redisValue = new RedisValue();
            redisValue = JsonConvert.SerializeObject(user);
            return redisValue;
        }
    }
}