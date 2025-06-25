// scripts/generate-mythril-input.js
const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat'); // Importa ethers e hardhat para acesso ao config e artifacts

async function main() {
    // Obter a configuração de solidity
    const solidityConfig = hre.config.solidity;
    const compilerVersion = solidityConfig.compilers[0].version; // Assumindo uma única versão

    // Percorrer todos os arquivos Solidity e ler seu conteúdo
    const sources = {};
    const contractsDir = path.resolve(__dirname, '../contracts'); // Ajuste o caminho se necessário
    const nodeModulesDir = path.resolve(__dirname, '../node_modules');

    function readSolidityFiles(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                readSolidityFiles(filePath);
            } else if (file.endsWith('.sol')) {
                // Determine o nome de "origem" correto (relativo ao Hardhat project root)
                let sourceName;
                if (filePath.startsWith(contractsDir)) {
                    sourceName = path.relative(path.resolve(__dirname, '..'), filePath).replace(/\\/g, '/');
                } else if (filePath.startsWith(nodeModulesDir)) {
                    sourceName = path.relative(path.resolve(__dirname, '..'), filePath).replace(/\\/g, '/');
                } else {
                    sourceName = path.relative(path.resolve(__dirname, '..'), filePath).replace(/\\/g, '/');
                }
                sources[sourceName] = {
                    content: fs.readFileSync(filePath, 'utf8')
                };
            }
        });
    }

    readSolidityFiles(contractsDir);
    readSolidityFiles(nodeModulesDir); // Incluir node_modules para os imports OpenZeppelin/Uniswap

    const standardInput = {
        language: 'Solidity',
        sources: sources,
        settings: {
            optimizer: solidityConfig.compilers[0].settings.optimizer,
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode']
                }
            },
            // Você pode precisar adicionar remappings aqui também se seus imports não forem resolvidos automaticamente
            // pelo Mythril de outra forma, mas o `sources` já deve ajudar muito.
        },
        // Certifique-se que o compilador correto seja usado se houver múltiplos pragma.
        // O Mythril geralmente lida com isso, mas você pode ter problemas se tiver muitos pragma diferentes.
    };

    const outputPath = 'mythril-input.json';
    fs.writeFileSync(outputPath, JSON.stringify(standardInput, null, 2));

    console.log(`Mythril Standard JSON input generated at: ${outputPath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });