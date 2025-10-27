<div align="center">

# React Native Music Player UI Kit (TrackPlayer + Reanimated)

Fluxo completo de player de música no estilo Spotify: MiniPlayer → PlayerScreen com controles, animações e compartilhamento.

<p>
	<img alt="Demo" src="./.github/demo-player.gif" height="420" />
	<br/>
	<em>Preview ilustrativo — adicione seus GIFs/prints em .github/</em>
  
</p>

</div>

## Visão geral

Este projeto entrega um player de música moderno e pronto para uso em React Native, combinando experiência premium de UI/UX com integrações reais de áudio e conteúdo. O fluxo principal demonstra a navegação de 1 toque do `MiniPlayer` para a `PlayerScreen`, com todos os controles essenciais, animações suaves e um bottom sheet para ações como compartilhar.

Ideal para squads e devs que querem acelerar MVPs, produtos e estudos práticos de arquitetura com `react-native-track-player` + `react-native-reanimated` + `React Navigation` — tudo em TypeScript.

## Destaques do kit

- Navegação fluida: MiniPlayer → PlayerScreen (1 toque)
- Controles completos: Play/Pause, Anterior/Próxima, Seek (Slider)
- Shuffle e Repeat (inclui Repeat Track com badge “1”)
- Bottom Sheet de opções com compartilhamento
- Animações suaves (Reanimated) e gradientes dinâmicos
- UI dark, responsiva e pronta para produção
- Integração real com conteúdo (Deezer – previews de ~30s)
- Arquitetura com hook dedicado (`useMusicPlayer`) e serviços bem definidos

## O que está incluído

### Telas

- `MainScreen` – hub principal com seções e destaques
- `PlayerScreen` – player completo com capa, controles e progresso
- `AuthorPlaylistScreen` – melhores faixas por artista
- `AlbumScreen`, `PlaylistScreen`, `RadioScreen`, `PodcastScreen` – exemplos de listagens e detalhe

### Componentes

- `MiniPlayer`, `PlayerControls`, `ProgressBar`
- `TrackOptionsSheet` (bottom sheet com ações como compartilhar)
- `AlbumCard`, `PodcastHeroCard`, `PodcastGrid`, `Avatar`
- `BottomSheet` base e utilitários visuais

### Arquitetura e serviços

- Hook: `src/hooks/useMusicPlayer.ts`
- Setup do player: `src/player/setup.ts`
- API de dados: `src/services/api.ts` (uso do Deezer para feeds e previews)

### Tecnologias

- React Native 0.82 + React 19 + TypeScript
- `react-native-track-player` v5 (alpha/nightly)
- `react-native-reanimated` 4
- `@react-native-community/slider`, `react-native-linear-gradient`
- `@react-navigation/native` + `@react-navigation/native-stack`
- `lucide-react-native` (ícones), `axios`, RNGH, Screens, Safe Area Context, SVG

## Pré-requisitos

- Node 20+
- Xcode + CocoaPods (iOS)
- Android Studio + SDKs (Android)
- macOS para build iOS
- Internet (consumo de API Deezer pública)

Observações importantes:

- As faixas do Deezer expõem apenas previews (~30s). Para reprodução completa, utilize seu próprio backend/stream ou outra fonte licenciada.
- Alguns endpoints personalizados do Deezer exigem OAuth (ex.: “Mais do que você curte”). Este kit usa endpoints públicos por padrão.

## Como começar

1) Instale as dependências

```bash
# opcionalmente, na raiz do monorepo; aqui focamos no app TrackPlayer
cd TrackPlayer
npm install
```

2) iOS – instale pods

```bash
cd ios && pod install && cd ..
```

3) Execute o Metro e a plataforma desejada

```bash
# Terminal 1
npm run start

# Terminal 2 (Android)
npm run android

# Terminal 2 (iOS)
npm run ios
```

### Configurações nativas recomendadas

- iOS (Xcode):
	- Capabilities → Background Modes: marque “Audio, AirPlay, and Picture in Picture”.
	- Habilite Remote Control (o `react-native-track-player` gerencia eventos de controle).
- Android:
	- As permissões e o serviço são adicionados via autolinking do TrackPlayer v5 (Media3). Caso personalize o notification channel/ícones, ajuste no nativo conforme a doc da lib.

## Estrutura de pastas (resumo)

```
TrackPlayer/
	App.tsx
	index.js
	package.json
	ios/
	android/
	src/
		components/
			AlbumCard.tsx
			Avatar.tsx
			BottomSheet.tsx
			MiniPlayer.tsx
			PlayerControls.tsx
			PodcastGrid.tsx
			PodcastHeroCard.tsx
			ProgressBar.tsx
			TrackOptionsSheet.tsx
			index.ts
		hooks/
			useMusicPlayer.ts
		player/
			setup.ts
		screens/
			MainScreen.tsx
			PlayerScreen.tsx
			AuthorPlaylistScreen.tsx
			AlbumScreen.tsx
			PlaylistScreen.tsx
			RadioScreen.tsx
			PodcastScreen.tsx
		services/
			api.ts
	types.ts
```

## Como funciona (contrato rápido)

- Fonte de dados: `src/services/api.ts` (Deezer público + utilitários). Cada track segue o shape:
	- `{ id, title, artist, album, albumCover, preview, duration }`
- Fila de reprodução: configurada via `useMusicPlayer` e `TrackPlayer.add(...)` no setup inicial.
- Estados: progresso (`useProgress`), estado de playback (`usePlaybackState`), faixa ativa e índice.
- PlayerScreen: controla seek, play/pause, prev/next, shuffle visual e repeat (Queue/Track/Off), e aciona o `TrackOptionsSheet` para compartilhar.

## Personalização

- Cores/gradientes do Player: `src/screens/PlayerScreen.tsx` (LinearGradient/Animated)
- Ícones e tamanhos: `lucide-react-native` (substitua ou ajuste `size`, `color`)
- Conteúdo: troque a implementação de `api.ts` pelo seu backend/SDK
- Tipografia, espaçamentos e radius: via StyleSheet nas telas/componentes
- Navegação: configure stacks/rotas em `App.tsx` (React Navigation)

## Perguntas frequentes (FAQ)

1) Por que só toca 30 segundos?

— O Deezer expõe previews públicos de ~30s. Para faixas completas, você deve usar fontes licenciadas ou seu próprio streaming.

2) Funciona em background e com controles do sistema?

— Sim. O `react-native-track-player` v5 usa Android Media3 e integra com Control Center no iOS. Habilite os Background Modes no iOS conforme acima.

3) Posso usar meus próprios URLs de áudio?

— Sim. Basta montar a fila (`TrackPlayer.add`) com seus `url`/metadados.

4) Preciso de OAuth do Deezer?

— Não para os feeds públicos de exemplo. Endpoints personalizados (como “curtidas” do usuário) exigem token.

## Licença

MIT — Use livremente em projetos pessoais e comerciais. Respeite os termos de uso das APIs/serviços de terceiros (Deezer, ícones, etc.).

## Créditos e referências

- [react-native-track-player](https://github.com/doublesymmetry/react-native-track-player)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Lucide Icons](https://lucide.dev/)
- Conteúdo de demonstração: API pública Deezer

## Contribua e conecte-se

Curtiu o kit? Deixe uma ⭐ no repositório, abra issues/sugestões e compartilhe com a comunidade.

Siga para mais conteúdos práticos de React Native, animações e players reais prontos para produção.

