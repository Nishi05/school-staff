import React, { Component } from 'react'
import './Home.css'
export default class Home extends Component {
  render() {
    return (
      <div className="text-center">
        <h2>スクスタとは?</h2>
        <hr />
        <h3>人手不足の学校と学生マッチングさせる掲示板サービスです。</h3>
        <p>
          ２０２１年度の文科科学省における実態調査で公立学校の教員不足が明らかになりました。
        </p>
        <p>背景として以前から問題視されていた教員の長時間労働が存在します。</p>
        <p>
          このサービスを通して、人材不足に直面している学校と学校での経験を積みたい学生を繋げるようにしていきます。
        </p>
      </div>
    )
  }
}
