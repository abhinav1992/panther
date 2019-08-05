using Enyim.Caching;
using Enyim.Caching.Configuration;
using Enyim.Caching.Memcached;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace OnlineGame.Cache
{
    public class MemcachedCacheProvider : ICacheProvider
    {
        private MemcachedClientConfiguration _config = null;
        private MemcachedClient _client = null;
        public MemcachedCacheProvider()
        {
            _config = new MemcachedClientConfiguration();
            IPAddress address = IPAddress.Parse("192.168.11.239");
            _config.Servers.Add(new IPEndPoint(address, 11211));
            _config.Protocol = MemcachedProtocol.Text;
            _client = new MemcachedClient(_config);
        }
        public string GetString(string key)
        {
            return _client.Get<string>(key);
        }

        public void StoreString(string key, string value, int expiresIn = 200)
        {
            _client.Store(StoreMode.Set, key, value, DateTime.Now.AddSeconds(expiresIn));
        }

        public void StoreObject<T>(string key, T value, int expiresIn = 200)
        {
            _client.Store(StoreMode.Set, key, JsonConvert.SerializeObject(value), DateTime.Now.AddSeconds(expiresIn));
        }

        public T GetObject<T>(string key)
        {
            T obj = default(T);
            var str = _client.Get<string>(key);
            if (!string.IsNullOrEmpty(str))
            {
                obj = JsonConvert.DeserializeObject<T>(str);
            }

            return obj;
        }

        public List<T> GetList<T>(string key)
        {
            throw new NotImplementedException();
        }

        public void StoreList<T>(string key, List<T> values, int expiresIn = 200)
        {
            throw new NotImplementedException();
        }
    }
}
