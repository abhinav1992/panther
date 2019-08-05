using System;

namespace OnlineGame.Cache.Helpers
{
    public class RedisConnectionHelper
    {
        static RedisConnectionHelper()
        {
            _redisConnection = new Lazy<StackExchange.Redis.ConnectionMultiplexer>(() =>
            {
                StackExchange.Redis.ConfigurationOptions options = new StackExchange.Redis.ConfigurationOptions();

                return StackExchange.Redis.ConnectionMultiplexer.Connect(System.Configuration.ConfigurationManager.AppSettings["RedisKey"]);
            });
        }

        private static Lazy<StackExchange.Redis.ConnectionMultiplexer> _redisConnection;

        public static StackExchange.Redis.ConnectionMultiplexer RedisConnection
        {
            get
            {
                return _redisConnection.Value;
            }
        }
    }
}
