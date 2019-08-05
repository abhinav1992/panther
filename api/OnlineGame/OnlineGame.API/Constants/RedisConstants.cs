using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineGame.API.Constants
{
    public static class RedisConstants
    {
        public const string LIST_ONLINE_USER = "list_online_user";
        public const string USER_CONNECTION_KEY_PREFIX = "online_users";
        public const string USER_NAME = "name";
        public const string CONNECTION_ID = "connectionId";
    }
}