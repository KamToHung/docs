# 项目翻译相关的命令

# 一键生成所有语言的翻译文件
trans:
	@echo "正在生成所有支持语言的翻译文件..."
	npx docusaurus write-translations --locale en
	npx docusaurus write-translations --locale es
	npx docusaurus write-translations --locale fr
	npx docusaurus write-translations --locale de
	npx docusaurus write-translations --locale ja
	npx docusaurus write-translations --locale ko
	npx docusaurus write-translations --locale hi
	@echo "所有翻译文件已生成完成!"

# 生成单个语言的翻译文件
trans-en:
	npx docusaurus write-translations --locale en

trans-es:
	npx docusaurus write-translations --locale es

trans-fr:
	npx docusaurus write-translations --locale fr

trans-de:
	npx docusaurus write-translations --locale de

trans-ja:
	npx docusaurus write-translations --locale ja

trans-ko:
	npx docusaurus write-translations --locale ko

trans-hi:
	npx docusaurus write-translations --locale hi

.PHONY: trans trans-en trans-es trans-fr trans-de trans-ja trans-ko trans-hi
