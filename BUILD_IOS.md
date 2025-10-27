# Build iOS sem Mac

Este projeto está configurado para fazer build do iOS usando GitHub Actions, sem precisar de Mac.

## Como funciona

1. **GitHub Actions** roda em runners macOS gratuitos
2. **Faz build automático** quando você faz push para main/master
3. **Gera arquivo .ipa** que pode ser instalado em dispositivos iOS
4. **Cria releases automáticos** com os builds

## Como usar

### 1. Configurar o repositório no GitHub
```bash
# Adicionar o repositório remoto (se ainda não tiver)
git remote add origin https://github.com/SEU-USUARIO/nosso-ritmo.git

# Fazer push do código
git add .
git commit -m "Configurar build iOS"
git push -u origin main
```

### 2. Configurar Team ID (Opcional)
Se você tem uma conta de desenvolvedor Apple, edite o arquivo `ios/App/exportOptions.plist` e substitua `YOUR_TEAM_ID` pelo seu Team ID.

### 3. Executar o build
- **Automático**: Faça push para a branch main/master
- **Manual**: Vá em Actions no GitHub e clique em "Run workflow"

### 4. Baixar o build
- Vá em **Actions** no seu repositório GitHub
- Clique no workflow que acabou de rodar
- Baixe os artifacts na seção "Artifacts"
- Ou vá em **Releases** para baixar a versão mais recente

## Arquivos importantes

- `.github/workflows/build-ios.yml` - Configuração do GitHub Actions
- `ios/App/exportOptions.plist` - Configurações de exportação do Xcode
- `capacitor.config.ts` - Configuração do Capacitor

## Troubleshooting

### Build falha
1. Verifique os logs no GitHub Actions
2. Certifique-se que o projeto compila localmente (`npm run build`)
3. Verifique se todas as dependências estão no `package.json`

### Erro de Team ID
- Para builds de desenvolvimento, pode deixar `YOUR_TEAM_ID`
- Para distribuição na App Store, precisa do Team ID real

### Erro de CocoaPods
- O workflow instala CocoaPods automaticamente
- Se der erro, pode ser problema de dependências nativas

## Próximos passos

1. **TestFlight**: Para distribuir via TestFlight
2. **App Store**: Para publicar na App Store
3. **Certificados**: Configurar certificados de distribuição
4. **Provisioning Profiles**: Para dispositivos específicos
