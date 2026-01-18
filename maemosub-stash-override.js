/**
 * Stash Override Script
 * 
 * 功能：
 * 1. 注入自定义的国家/地区分组（以及自动选择、全部节点等）。
 * 2. 注入 "🔰 自选分组" 作为根级入口。
 * 3. 自动将 "🔰 自选分组" 添加到主配置中已存在的 "🐟 漏网之鱼"、"🚀 节点选择" 等分组的首位。
 * 4. 补充必要的规则。
 */

function main(config) {
    // 1. 定义我们要添加的新分组
    const customGroups = [
        {
            "name": "🔰 自选分组",
            "type": "select",
            "proxies": [
                "自动选择",
                "DIRECT",
                "HK 香港",
                "TW 台湾省",
                "JP 日本",
                "CA 加拿大",
                "US 美国",
                "DE 德国",
                "UK 英国",
                "SG 新加坡",
                "FR 法国",
                "TH 泰国",
                "其它地区",
                "全部节点"
            ]
        },
        {
            "name": "HK 香港",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(澳门|🇲🇴|港|🇭🇰|hk|hong|hongkong|hong kong)"
        },
        {
            "name": "TW 台湾省",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(台|🇹🇼|湾|tw|taiwan)"
        },
        {
            "name": "JP 日本",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(日|🇯🇵|东京|大阪|jp|japan)"
        },
        {
            "name": "CA 加拿大",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(加拿大|🇨🇦|ca|canada)"
        },
        {
            "name": "US 美国",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(美|🇺🇸|us|usa|america|united states|usa)"
        },
        {
            "name": "DE 德国",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(德|德国|🇩🇪|de|germany)"
        },
        {
            "name": "SG 新加坡",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(新加坡|新|🇸🇬|sg|singapore)"
        },
        {
            "name": "FR 法国",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(法|fr|france|paris|🇫🇷)"
        },
        {
            "name": "UK 英国",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(英|英国|uk|britain|london)"
        },
        {
            "name": "TH 泰国",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)(泰|th|thailand|bangkok|🇹🇭)"
        },
        {
            "name": "其它地区",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true,
            "filter": "(?i)^(?!.*(?:香港|hk|日本|jp|美国|us|台湾|tw|加拿大|ca|德国|de|新加坡|sg|法国|fr|英国|uk)).*"
        },
        {
            "name": "自动选择",
            "type": "url-test",
            "include-all": true,
            "interval": 120,
            "tolerance": 50,
            "lazy": true
        },
        {
            "name": "全部节点",
            "type": "select",
            "include-all": true
        }
    ];

    // 2. 将新分组添加到配置中 (去重，防止报错)
    if (!config['proxy-groups']) {
        config['proxy-groups'] = [];
    }
    
    // 过滤掉原本可能已经存在的同名组（虽然不太可能，但为了安全）
    const newGroupNames = new Set(customGroups.map(g => g.name));
    config['proxy-groups'] = config['proxy-groups'].filter(g => !newGroupNames.has(g.name));
    
    // 添加我们的新组
    config['proxy-groups'].push(...customGroups);

    // 3. 注入逻辑：把 "🔰 自选分组" 塞进特定的目标组
    // 目标组列表：可以包含你猜测的任何根组名
    const targetGroupNames = ["🐟 漏网之鱼", "🚀 节点选择", "Proxy", "节点选择", "FALLBACK", "Final"];
    const groupToInject = "🔰 自选分组";

    config['proxy-groups'].forEach(group => {
        if (targetGroupNames.includes(group.name)) {
            // 确保该组有 proxies 列表
            if (!group.proxies) {
                group.proxies = [];
            }
            // 避免重复添加
            if (!group.proxies.includes(groupToInject)) {
                // 插入到第一个位置，方便选择
                group.proxies.unshift(groupToInject);
            }
        }
    });

    // 4. 补充规则 ( prepend 模式，插到最前 )
    const customRules = [
        "DOMAIN,localhost,DIRECT",
        "DOMAIN,github.com,自动选择",
        "DOMAIN,api.github.com,自动选择",
        "DOMAIN,*.githubusercontent.com,自动选择"
    ];

    if (!config['rules']) {
        config['rules'] = [];
    }
    // 插入到规则列表头部
    config['rules'].unshift(...customRules);

    return config;
}
