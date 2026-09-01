export interface AboutItem {
    icon: string;
    title: string;
    description: string;
    accent: 'primary' | 'accent' | 'secondary';
}

export const conceptItems: AboutItem[] = [
    {
        icon: 'ri-focus-3-line',
        title: '「どこで何が起きたか」が分かる',
        description: '人感・開閉・振動センサーを場所ごとにタグで整理。検知内容と時刻を一元管理し、どこで何が起きたかをひと目で把握できます。',
        accent: 'primary',
    },
    {
        icon: 'ri-stack-line',
        title: '重要な通知を見逃さない',
        description: '未確認の通知はアンバーで強調し、時系列の通知一覧で確認。タグやセンサー名で絞り込めるので、埋もれがちな記録もすぐ見つけられます。',
        accent: 'accent',
    },
    {
        icon: 'ri-magic-line',
        title: '難しい設定はいらない',
        description: 'センサーの追加は名前とIPアドレスを入力するだけ。タグや通知先も直感的に設定でき、チュートリアルで迷わず使い始められます。',
        accent: 'secondary',
    },
];

export const featureItems: AboutItem[] = [
    {
        icon: 'ri-radar-line',
        title: 'リアルタイム検知',
        description: 'センサーの状態を色・アイコン・ラベルで即時に表示。検知中は波紋アニメで直感的に知らせます。',
        accent: 'primary',
    },
    {
        icon: 'ri-notification-3-line',
        title: '通知一覧と絞り込み',
        description: '過去の検知を日付ごとに時系列表示。タグ・センサー名・確認状態で絞り込めます。',
        accent: 'accent',
    },
    {
        icon: 'ri-price-tag-3-line',
        title: 'タグによる整理',
        description: '場所や用途で色付きタグを作成し、センサーを分類・検索。一覧をスッキリ整理します。',
        accent: 'secondary',
    },
    {
        icon: 'ri-message-3-line',
        title: 'Slack / LINE 通知',
        description: '通知先を Slack や LINE に設定でき、検知を外部サービスでも受け取れます。通知音も選べます。',
        accent: 'primary',
    },
    {
        icon: 'ri-pause-circle-line',
        title: '無効化・有効化',
        description: '一時的に使わないセンサーはワンクリックで無効化。別の一覧にまとまり、いつでも復帰できます。',
        accent: 'accent',
    },
    {
        icon: 'ri-slideshow-4-line',
        title: '直感的なダッシュボード',
        description: 'サマリーや通知あり・全センサーの一覧をひとつの画面で確認。日々の見守りが楽になります。',
        accent: 'secondary',
    },
];

export const scenarioItems: AboutItem[] = [
    {
        icon: 'ri-shopping-bag-3-line',
        title: '置き配・宅配便の見守り',
        description: '玄関に置いた荷物を検知して、届いたことをいち早くお知らせ。再配達を減らしたい方に。',
        accent: 'primary',
    },
    {
        icon: 'ri-door-lock-line',
        title: '玄関・防犯',
        description: 'ドアの開閉や人感を検知し、不審な動きを記録。在宅中・外出中を問わず安心を見守ります。',
        accent: 'accent',
    },
    {
        icon: 'ri-archive-drawer-line',
        title: '店舗・倉庫の監視',
        description: '在庫エリアへの人の通過や物体の移動を検知。営業外の動きも見逃さず、管理を効率化します。',
        accent: 'secondary',
    },
    {
        icon: 'ri-home-smile-line',
        title: '自宅のおうち安全',
        description: '廊下や階段、ベランダの動きを検知して家族の安心をサポート。離れて暮らす家の見守りにも。',
        accent: 'primary',
    },
    {
        icon: 'ri-building-2-line',
        title: 'オフィスの入退室',
        description: '会議室や書斎の出入りを記録。共有スペースの利用状況をデータで把握できます。',
        accent: 'accent',
    },
    {
        icon: 'ri-service-line',
        title: '見守り・介護のサポート',
        description: '生活の動きを記録して、異変の早期発見につなげる。離れて暮らすご家族の見守りにも。',
        accent: 'secondary',
    },
];

export const audienceItems: AboutItem[] = [
    {
        icon: 'ri-shopping-cart-2-line',
        title: '通販をよく利用する方',
        description: '置き配の見逃しや再配達のストレスを解消し、荷物の到着を見逃しません。',
        accent: 'primary',
    },
    {
        icon: 'ri-home-5-line',
        title: '一人暮らしで安心したい方',
        description: '玄関や部屋の動きを見守り、気になる出来事を逃さず確認できます。',
        accent: 'accent',
    },
    {
        icon: 'ri-store-3-line',
        title: '店舗・倉庫を運営する方',
        description: '営業時間外の動きや在庫エリアの変化を記録し、管理を効率化します。',
        accent: 'secondary',
    },
    {
        icon: 'ri-heart-3-line',
        title: 'ご家族の見守りを考えている方',
        description: '離れて暮らす家の生活リズムを、データとしてやさしく見守れます。',
        accent: 'primary',
    },
];

export const stepsData = [
    {
        icon: 'ri-add-circle-line',
        title: 'センサーを追加',
        description: '名前とIPアドレスを入力して登録するだけ。',
    },
    {
        icon: 'ri-price-tag-3-line',
        title: 'タグで整理',
        description: '場所や用途のタグを付けて一覧をわかりやすく。',
    },
    {
        icon: 'ri-message-3-line',
        title: '通知を設定',
        description: '通知音や Slack / LINE の通知先を選びます。',
    },
    {
        icon: 'ri-rocket-line',
        title: 'さあ活用',
        description: '検知の記録を確認し、見守りを始めましょう。',
    },
];
