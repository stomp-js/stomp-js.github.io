#!/usr/bin/env ruby

require 'yaml'
require 'json'

authors = YAML.load(File.read('authors-src.yml'))
master = JSON.parse(File.read('../_data/versions/master.json'))

authors['stompjs']['links'].each do |link|
  x = link['label']
  link['label'] = "#{x}@#{master[x]}"
end

File.write('../_data/authors.yml', YAML.dump(authors))
