import https from 'https';

export default function httpsPost({body, ...options}:any) {
    return new Promise((resolve,reject) => {
        const req = https.request({
            method: 'POST',
            port: 443,
            ...options,
        }, (res: any) => {
            const chunks: any = [];
            res.on('data', (data:any) => chunks.push(data))
            res.on('end', () => {
                let body:any = Buffer.concat(chunks);
                body = body.toString('utf8');
                if(res.headers['content-type'].indexOf('application/json') >= 0){
                    body = JSON.parse(body);
                }
                resolve(body)
            })
        })
        req.on('error',reject);
        if(body) {
            req.write(body);
        }
        req.end();
    })
}