#!/usr/bin/env ruby

require 'json'

bundles = ENV['BUNDLES']

versions = Hash[(bundles.split.map do |l|
  version = JSON.parse(File.read("consolidated/#{l}/package.json"))['version']
  [l, version]
end)]

puts JSON.pretty_generate(versions)
