#!/usr/bin/env ruby

require 'json'

bundles = ENV['BUNDLES']

versions = Hash[(bundles.split.map do |l|
  version = JSON.parse(File.read("#{ENV['BASE']}/#{l}/package.json"))['version']
  [l, version]
end)]

puts JSON.pretty_generate(versions)
