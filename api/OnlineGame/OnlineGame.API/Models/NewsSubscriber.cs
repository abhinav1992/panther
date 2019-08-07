using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineGame.API.Models
{
    public class NewsSubscriber
    {
        public string ConnectionId { get; set; }
        public string Name { get; set; }
        public ISubscriber Subscriber { get; set; }
    }
}