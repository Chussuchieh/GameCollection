const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js'); // 引入xml2js库用于解析XML

function readPackageId(packagePath) {
    if (!fs.existsSync(packagePath)) {
        console.error(`package.xml文件不存在: ${packagePath}`);
        return null;
    }

    const xmlData = fs.readFileSync(packagePath);
    let packageId = null;

    xml2js.parseString(xmlData, (err, result) => {
        if (err) {
            console.error(`解析XML失败: ${err}`);
            return;
        }
        packageId = result.packageDescription.$.id; // 获取id属性
    });

    return packageId;
}

function writePackageId(packagePath, newId) {
    if (!fs.existsSync(packagePath)) {
        console.error(`package.xml文件不存在: ${packagePath}`);
        return;
    }

    const xmlData = fs.readFileSync(packagePath);
    let updatedXml = xmlData.toString().replace(/id=".*?"/, `id="${newId}"`); // 更新id属性

    fs.writeFileSync(packagePath, updatedXml);
}

function copyDirectory(sourcePath, destinationPath) {
    // 检查源目录是否存在
    if (!fs.existsSync(sourcePath)) {
        console.error(`源目录不存在: ${sourcePath}`);
        return;
    }

    // 创建目标目录
    fs.mkdirSync(destinationPath, { recursive: true });

    // 读取源目录中的所有文件和子目录
    const items = fs.readdirSync(sourcePath);

    items.forEach(item => {
        const sourceItemPath = path.join(sourcePath, item);
        const destinationItemPath = path.join(destinationPath, item);

        // 检查当前项是文件还是目录
        const stat = fs.statSync(sourceItemPath);
        if (stat.isDirectory()) {
            // 递归复制子目录
            copyDirectory(sourceItemPath, destinationItemPath);
        } else {
            // 复制文件
            fs.copyFileSync(sourceItemPath, destinationItemPath);
            // console.log(`已复制文件: ${sourceItemPath} 到 ${destinationItemPath}`);
        }
    });
}

function performCopyAndUpdateXml(sourcePath, destinationPath, allPackage) {
    // 读取目标路径下的package.xml文件
    const packagePath = path.join(destinationPath, 'package.xml');
    const oldPackageId = readPackageId(packagePath);
    if (oldPackageId) {
        console.log(`旧的packageDescription id: ${oldPackageId}`);
    }

    // 调用复制函数
    copyDirectory(sourcePath, destinationPath);

    // 复制完成后，更新package.xml中的id
    if (oldPackageId) {
        // 读取当前package.xml中的内容
        const xmlData = fs.readFileSync(packagePath); // 确保在这里读取xmlData
        let packageidTemp = null;
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                console.error(`解析XML失败: ${err}`);
                return;
            }
            packageidTemp = result.packageDescription.$.id; // 获取当前id属性
        });

        // 遍历目标路径下的所有XML文件并替换字符串
        function findXmlFiles(dir) {
            let results = [];
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat && stat.isDirectory()) {
                    // 递归查找子目录中的XML文件
                    results = results.concat(findXmlFiles(filePath));
                } else if (file.endsWith('.xml')) {
                    results.push(filePath);
                }
            });
            return results;
        }

        let allPackageList = {}
        if(allPackage){
            allPackageList = JSON.parse(decodeURIComponent(allPackage));
        }
        console.log(JSON.stringify(allPackageList))

        console.log('find', `ui://${packageidTemp}`, `pkg="${packageidTemp}`)
        const xmlFiles = findXmlFiles(destinationPath); // 使用递归函数查找所有XML文件
        xmlFiles.forEach(file => {
            let fileData = fs.readFileSync(file, 'utf-8');
            let hadChange = false
            if (fileData.includes(`ui://${packageidTemp}`)) {
                fileData = fileData.replace(new RegExp(`ui://${packageidTemp}`, 'g'), `ui://${oldPackageId}`);
                hadChange = true;
                console.log(`已更新文件: ${file}`);
            }
            if (fileData.includes(`pkg="${packageidTemp}`)) {
                fileData = fileData.replace(new RegExp(`pkg="${packageidTemp}`, 'g'), `pkg="${oldPackageId}`);
                hadChange = true;
                console.log(`已更新文件 pkg=: ${file}`);
            }
            for (let key in allPackageList) { // 使用 for...in 遍历对象
                if (fileData && fileData.includes(`ui://${key}`)) {
                    fileData = fileData.replace(new RegExp(`ui://${key}`, 'g'), `ui://${allPackageList[key]}`);
                    hadChange = true;
                    console.log(`已更新文件: ${file}`, `ui://${key}`, `ui://${allPackageList[key]}`);
                }
                if (fileData.includes(`pkg="${key}`)) {
                    fileData = fileData.replace(new RegExp(`pkg="${key}`, 'g'), `pkg="${allPackageList[key]}`);
                    hadChange = true;
                    console.log(`已更新文件: ${file}`);
                }
                if (key.includes('game_') && fileData.includes(key)) {
                    fileData = fileData.replace(new RegExp(key, 'g'), allPackageList[key]);
                    hadChange = true;
                    console.log(`已更新文件: ${file}`);
                }
            }
            if(hadChange){
                fs.writeFileSync(file, fileData);
            }
        });

        // 在所有复制操作完成后再更新package.xml中的id
        writePackageId(packagePath, oldPackageId);
    }
}

// 从命令行参数获取源路径和目标路径
const sourcePath = process.argv[2];
const destinationPath = process.argv[3];
const allPackage = process.argv[4];

// 调用复制和更新函数
console.log(`开始调用`);
performCopyAndUpdateXml(sourcePath, destinationPath, allPackage);
