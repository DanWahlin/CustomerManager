#!/usr/bin/ruby -w

filename = ARGV[0]
counter = 0
File.open("readfile.rb", "r") do |infile|
  while (line = infile.gets)
    puts "#{counter}: #{line}"
    counter = counter + 1
    end
  end
end