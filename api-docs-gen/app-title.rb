#!/usr/bin/env ruby

require 'json'

bundles = %w(stompjs rx-stomp)

parts = bundles.map do |l|
  version = JSON.parse(File.read("#{ENV['BASE']}/#{l}/package.json"))['version']
  "#{l}@#{version}"
end

puts parts.join(', ')
