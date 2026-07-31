//AppID Selection
//var strTrackId = "TempID"; //도메인에 따라 AppID 구분이 필요한 경우 If구문을 활성화 함.
var strTrackId = "LSE_MCS_POC"; //Application 이름
if(location.host.indexOf("APP_DOMAIN.daelim.co.kr") > -1){
        strTrackId = "LSE_MCS_POC";
}

window.daelimEUEMConf = {
                trackId: strTrackId,
                uri: 'https://kafkarestapi.daelim.co.kr', //Kafka REST Proxy URI
                kafkaTopicPrefix: "/topics/EuemPerf_", //Topic Name Prefix
                conType: "application/vnd.kafka.avro.v2+json", //Header:Content-Type
                accType: "application/vnd.kafka.v2+json, application/vnd.kafka+json, application/json", //Header:Accept-Type
                kafkaxhrMethod: "POST", //Request Method Type
                opt: {
                    onerror: true,
                    xhr: {
                        use: true,
                        exceptionFilters: ['css?postfix','.wq?','xml?postfix', 'js?postfix', 'common.js', 'googleapis.com', 'gstatic.com', 'google.com/recaptcha']
                    },
                    E2E: {
                        use: true,
                        useHeader: true,
                        n$apm: '${n$apm}'
                    },
                    expTime: {
                        use: true,
                        clickReport: false
                    }
                }
};