using Newtonsoft.Json;
using OnlineGame.Cache.Helpers;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace OnlineGame.Cache
{
    public class RedisCacheProvider : ICacheProvider
    {
        StackExchange.Redis.IDatabase _cacheDatabase = null;
        public RedisCacheProvider()
        {
            _cacheDatabase = RedisConnectionHelper.RedisConnection.GetDatabase();
        }

        public List<T> GetList<T>(string key)
        {
            var list = _cacheDatabase.ListRange(key);
            List<T> values = new List<T>();
            foreach (var item in list)
            {
                var instance = JsonConvert.DeserializeObject<T>(item);
                values.Add(instance);
            }
            return values;
        }

        public T GetObject<T>(string key)
        {
            var hash = _cacheDatabase.HashGetAll(key);
            T obj = ConvertFromHashEntryArray<T>(hash);
            return obj;
        }

        public string GetString(string key)
        {
            return _cacheDatabase.StringGet(key);
        }

        public void StoreList<T>(string key, List<T> values, int expiresIn = 200)
        {
            RedisValue[] list = new RedisValue[values.Count];
            for (int i = 0; i < values.Count; i++)
            {
                string serializedString = JsonConvert.SerializeObject(values[i]);
                list[i] = serializedString;
            }
            _cacheDatabase.ListRightPush(key, list);
        }

        public void StoreObject<T>(string key, T value, int expiresIn = 200)
        {
            _cacheDatabase.HashSet(key, ConvertToHashEntryArray(value));
            _cacheDatabase.KeyExpire(key, DateTime.Now.AddSeconds(200));
        }

        public void StoreString(string key, string value, int expiresIn = 200)
        {
            _cacheDatabase.StringSet(key, value);
        }

        private T ConvertFromHashEntryArray<T>(StackExchange.Redis.HashEntry[] hashEntries)
        {
            if (hashEntries.Count() == 0)
            {
                return default(T);
            }

            var objInfo = typeof(T);
            T instance = (T)Activator.CreateInstance(objInfo);
            var obj = instance.GetType();

            foreach (var entry in hashEntries)
            {
                PropertyInfo propertyInfo = obj.GetProperty(entry.Name);
                propertyInfo.SetValue(instance, Convert.ChangeType(entry.Value, propertyInfo.PropertyType), null);
            }

            return instance;
        }

        private StackExchange.Redis.HashEntry[] ConvertToHashEntryArray<T>(T value)
        {
            var dict = value.AsDictionary();
            var entries = new StackExchange.Redis.HashEntry[dict.Count];
            int i = 0;
            foreach (var Item in dict)
            {
                entries[i++] = new StackExchange.Redis.HashEntry(Item.Key, Item.Value.ToString());
            }
            return entries;
        }
    }
}
