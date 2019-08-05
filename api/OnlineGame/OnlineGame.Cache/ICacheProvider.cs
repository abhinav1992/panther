using System.Collections.Generic;

namespace OnlineGame.Cache
{
    public interface ICacheProvider
    {
        void StoreString(string key, string value, int expiresIn = 200);
        void StoreObject<T>(string key, T value, int expiresIn = 200);
        void StoreList<T>(string key, List<T> values, int expiresIn = 200);
        string GetString(string key);
        T GetObject<T>(string key);
        List<T> GetList<T>(string key);
    }
}
