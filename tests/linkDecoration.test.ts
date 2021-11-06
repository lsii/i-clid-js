
import linkDecoration from "#/linkDecoration";
import ModeTypes from "#/ModeTypes";

describe('linkDecoration', () => {
  it('ignoreに記載されたクエリパラメータを除外する', () => {
    const locationUrl = 'https://a.com/a/?plt02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?plt02'
    const keys = []
    const ignoreKeys = ['uid', 'type']
    const mode = ModeTypes.REPLACE
    const expectLinkUrl = 'https://a.com/b/?plt02&clid=1'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })

  it('keysが空のときは、全てのパラメータを引き継ぐ', () => {
    const locationUrl = 'https://a.com/a/?plt02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?plt02'
    const keys = []
    const ignoreKeys = []
    const mode = ModeTypes.REPLACE
    const expectLinkUrl = 'https://a.com/b/?plt02&clid=1&uid=2&type=3'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })

  it('mode=replaceのとき、リンクのパラメータを置換する', () => {
    const locationUrl = 'https://a.com/a/?plt02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?plt03'
    const keys = []
    const ignoreKeys = []
    const mode = ModeTypes.REPLACE
    const expectLinkUrl = 'https://a.com/b/?plt02&clid=1&uid=2&type=3'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })

  it('keysのみ指定されたら、リンクのパラメータに追記される', () => {
    const locationUrl = 'https://a.com/a/?plt02&clid=1&uid=2&type=3'
    const linkUrl = 'https://a.com/b/?plt02'
    const keys = [ 'clid' ]
    const ignoreKeys = []
    const mode = ModeTypes.ADD
    const expectLinkUrl = 'https://a.com/b/?plt02&clid=1'
    expect(linkDecoration(locationUrl, linkUrl, keys, ignoreKeys, mode)).toEqual(expectLinkUrl)
  })
})
