# MyCalendar
## 開発環境
Django==2.2.8<br>
Python==3.7.0

### 使用方法
(作業ディレクトリで)<br>
$ git clone https://github.com/nr27bypphy/MyCalendar.git<br>
$ pip install -r requirements.txt<br>
$ python manage.py runserver

## これは何

あったらいいなと思うカレンダー

## 背景

・スマホでのカレンダー管理で大変なのは、月の予定の可視化<br>
・毎日の習慣、定期的な予定は見せなくていい（UIの向上）<br>
（将来的に）・睡眠を管理しているが、カレンダーと連動できるものが少ない。

## ターゲット

・Googleカレンダーのユーザー<br>
・スマホでしか見ない<br>
（将来的に）・睡眠を管理している人

## 実装したい機能
### 管理したいもの

・自分の予定(仕事用プライベート用)<br>
（将来的に）・他の人の予定<br>
（将来的に）・睡眠時間

### 最低要件

・ログイン、ログアウト<br>
・カレンダーの切り替え（仕事用プライベート用）<br>
・月でのカレンダー可視化<br>
・日毎のカレンダー可視化<br>
・予定の追加<br>
・予定の削除<br>
・予定の変更

### （将来的に）やりたいこと

・推奨睡眠時間のレコメンド<br>
・その日の睡眠時間(自動で取りたい)<br>
・その日のパフォーマンスの振り返り
